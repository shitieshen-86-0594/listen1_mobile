import React from 'react';
import { View, Text, StyleSheet, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import Slider from 'react-native-slider';
import { BlurView } from '@react-native-community/blur';
import Svg, { Circle, Line } from 'react-native-svg';

import ModalLiteContainer from './modal-lite-container.screen';
import PlayerControl from './player-control.screen';
import PlayerNav from './player-nav.screen';

import {
  togglePlay,
  toggleModal,
  prevTrack,
  nextTrack,
  updatePlayer,
  openModalLite,
  changePlayMode,
  addToMyFavorite,
  removeFromMyFavorite,
} from '../../redux/actions';

import { colors } from '../../config/colors';
import { modalPlayerSetting } from '../../config/settings';

const ModalPlayer = styled.View`
  flex: 1;
  background: #1a2620;
  padding-top: ${modalPlayerSetting.paddingTop};
  padding-bottom: ${modalPlayerSetting.paddingBottom};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const transTime = (time) => {
  const minute = Math.floor(time / 60);
  const second = Math.floor(time % 60);
  return `${minute > 10 ? minute : `0${minute}`}:${
    second > 9 ? second : `0${second}`
  }`;
};

class ModalPlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isPlaylistOpen: false,
      bpm: '87.00',
      stats: { dynamicRange: '3.8', loudness: '-6.6' }
    };

    this.onControlPlayMode = this.onControlPlayMode.bind(this);
    this.onControlPrev = this.onControlPrev.bind(this);
    this.onControlPlay = this.onControlPlay.bind(this);
    this.onControlNext = this.onControlNext.bind(this);
    this.onControlPlaylist = this.onControlPlaylist.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onFav = this.onFav.bind(this);
  }

  componentDidUpdate(prevProps) {
    const prevTrack = prevProps.playerState.nowplayingTrack;
    const currTrack = this.props.playerState.nowplayingTrack;
    
    if (prevTrack !== currTrack) {
      this.calculateRealBPM();
    }

    if (this.props.playerState.duration > 0) {
      const progress =
        this.props.playerState.current / this.props.playerState.duration;
      if (!this.props.playerState.isSeeking) {
        this.setState({ progress });
      }
    }
  }

  calculateRealBPM = async () => {
    const { nowplayingTrack } = this.props.playerState;
    if (!nowplayingTrack) return;

    const audioPath = nowplayingTrack.path || nowplayingTrack.audioUrl || '';
    if (!audioPath) return;

    try {
      const { AudioAnalyzerModule } = NativeModules;
      if (AudioAnalyzerModule) {
        const result = await AudioAnalyzerModule.getRealBPM(audioPath);
        if (result) this.setState({ bpm: result });
      }
    } catch (e) {
      this.setState({ bpm: '87.00' });
    }
  };

  onControlPlayMode = () => this.props.dispatch(changePlayMode());
  onControlPrev = () => this.props.dispatch(prevTrack());
  onControlPlay = () => this.props.dispatch(togglePlay());
  onControlNext = () => this.props.dispatch(nextTrack());
  onControlPlaylist = () => {
    this.props.dispatch(openModalLite({ height: 500, type: 'nowplaying' }));
  };
  onBack = () => this.props.dispatch(toggleModal());
  onFav = () => {
    if (this.props.playerState.nowplayingTrack === null) return;
    this.props.dispatch(
      this.getFavStatus()
        ? removeFromMyFavorite(this.props.playerState.nowplayingTrack)
        : addToMyFavorite(this.props.playerState.nowplayingTrack)
    );
  };
  getFavStatus() {
    const { nowplayingTrack } = this.props.playerState;
    const { myFavoriteIds } = this.props.myPlaylistState;
    if (!nowplayingTrack) return false;
    return myFavoriteIds[nowplayingTrack.id] !== undefined;
  }
  sliderChange = (value) => {
    this.setState({ progress: value });
    const currentTime = this.props.playerState.duration * value;
    this.props.dispatch(updatePlayer({ seek: currentTime }));
  };

  render() {
    const { nowplayingTrack } = this.props.playerState;
    const noTrack = nowplayingTrack === null;
    const isFav = this.getFavStatus();
    const { bpm, stats } = this.state;

    return (
      <ModalPlayer>
        <PlayerNav onBack={this.onBack} onMore={this.onBack} />

        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 220, height: 220 }}>
            <Svg height="220" width="220" viewBox="0 0 220 220">
              <Circle cx="110" cy="110" r="100" stroke="#4A5E62" strokeWidth="1" fill="none" />
              <Line x1="110" y1="10" x2="110" y2="210" stroke="#4A5E62" strokeWidth="1" />
              <Line x1="10" y1="110" x2="210" y2="110" stroke="#4A5E62" strokeWidth="1" />
              <Circle cx="110" cy="40" r="2" fill="#FFD700" />
              <Circle cx="40" cy="110" r="2" fill="#FFD700" />
            </Svg>
            <ModalSongCover
              source={noTrack ? './assets/images/logo.png' : nowplayingTrack.img_url}
            />
          </View>
        </View>

        <View style={{ flex: 7, paddingRight: 20, justifyContent: 'center' }}>
          <BlurView style={styles.glassContainer} blurType="dark" blurAmount={15} reducedTransparencyFallbackColor="black">
            <Text style={styles.title}>{noTrack ? '暂无歌曲' : nowplayingTrack.title}</Text>
            <Text style={styles.artist}>By {noTrack ? '未知' : nowplayingTrack.artist}</Text>
            
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ width: 80 }}><Text style={styles.metricLabel}>BPM</Text><Text style={styles.metricVal}>{bpm}</Text></View>
              <View style={{ width: 100 }}><Text style={styles.metricLabel}>Genre</Text><Text style={styles.metricVal}>Angelcore</Text></View>
            </View>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 24 }}>
              <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Dynamic range</Text><Text style={styles.metricVal}>{stats.dynamicRange} dB</Text></View>
              <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Loudness</Text><Text style={styles.metricVal}>{stats.loudness} LUFS</Text></View>
              <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Sample rate</Text><Text style={styles.metricVal}>48.0 kHz</Text></View>
              <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Bitrate</Text><Text style={styles.metricVal}>1641 kbps</Text></View>
            </View>

            <View style={styles.sliderBtn}>
              <ModalSongTime>{transTime(this.props.playerState.current)}</ModalSongTime>
              <Slider
                maximumTrackTintColor={colors.black}
                minimumTrackTintColor={colors.theme}
                thumbStyle={styles.thumb}
                trackStyle={{ height: 2 }}
                style={{ flex: 1 }}
                value={this.state.progress}
                onSlidingStart={() => { this.props.dispatch(updatePlayer({ isSeeking: true })); }}
                onSlidingComplete={(value) => { this.sliderChange(value); }}
              />
              <ModalSongTime>{transTime(this.props.playerState.duration)}</ModalSongTime>
            </View>

          </BlurView>
        </View>

        <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center', paddingBottom: 20 }}>
          <PlayerControl
            isPlaying={this.props.playerState.isPlaying}
            playMode={this.props.playerState.playMode}
            onPlayMode={this.onControlPlayMode}
            onPrev={this.onControlPrev}
            onPlay={this.onControlPlay}
            onNext={this.onControlNext}
            onPlaylist={this.onControlPlaylist}
          />
        </View>

        <ModalLiteContainer />
      </ModalPlayer>
    );
  }
}

const styles = StyleSheet.create({
  sliderBtn: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  thumb: {
    width: 14,
    height: 14,
    backgroundColor: '#00BCD4',
    borderColor: '#000',
    borderWidth: 4,
    borderRadius: 7,
  },
  glassContainer: {
    padding: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '80%',
    justifyContent: 'center',
    marginTop: 40,
  },
  title: { color: '#00BCD4', fontSize: 28, fontWeight: 'bold' },
  artist: { color: '#FFFFFF', fontSize: 14, marginTop: 4 },
  metricLabel: { color: '#4A5E62', fontSize: 10 },
  metricVal: { color: 'white', fontSize: 16 },
});

const ModalSongCover = styled.View``;
const ModalSongTime = styled.Text`
  width: 50;
  flex: 0 50px;
  text-align: center;
  color: ${(props) => props.theme.secondaryColor};
`;

export default connect(({ playerState, myPlaylistState }) => ({
  playerState,
  myPlaylistState,
}))(withTheme(ModalPlayerView));
