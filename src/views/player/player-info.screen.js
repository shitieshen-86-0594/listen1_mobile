import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

export default function PlayerInfoScreen({ title, artist, bpm = "87.00", stats }) {
  return (
    <BlurView style={styles.glassContainer} blurType="dark" blurAmount={15} reducedTransparencyFallbackColor="black">
      <Text style={styles.title}>{title || "worry (Slowed)"}</Text>
      <Text style={styles.artist}>By {artist || "LONOWN / Riserayss"}</Text>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View style={{ width: 80 }}><Text style={styles.metricLabel}>BPM</Text><Text style={styles.metricVal}>{bpm}</Text></View>
        <View style={{ width: 100 }}><Text style={styles.metricLabel}>Genre</Text><Text style={styles.metricVal}>Angelcore</Text></View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 24 }}>
        <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Dynamic range</Text><Text style={styles.metricVal}>{stats?.dynamicRange || "3.8"} dB</Text></View>
        <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Loudness</Text><Text style={styles.metricVal}>{stats?.loudness || "-6.6"} LUFS</Text></View>
        <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Sample rate</Text><Text style={styles.metricVal}>48.0 kHz</Text></View>
        <View style={{ width: 100, marginBottom: 8 }}><Text style={styles.metricLabel}>Bitrate</Text><Text style={styles.metricVal}>1641 kbps</Text></View>
      </View>
    </BlurView>
  );
}
const styles = StyleSheet.create({
  glassContainer: { padding: 20, borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', height: '70%', justifyContent: 'center', marginRight: 20 },
  title: { color: '#00BCD4', fontSize: 28, fontWeight: 'bold' },
  artist: { color: '#FFFFFF', fontSize: 14, marginTop: 4 },
  metricLabel: { color: '#4A5E62', fontSize: 10 },
  metricVal: { color: 'white', fontSize: 16 },
});
