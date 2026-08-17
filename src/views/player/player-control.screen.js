import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function PlayerControlScreen({ isPlaying, onPlayPause }) {
  return (
    <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center', marginBottom: 20 }}>
      <TouchableOpacity onPress={onPlayPause}>
        <View style={styles.playButton}>
          <View style={{ width: 12, height: 16, backgroundColor: 'white' }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  playButton: { width: 60, height: 60, backgroundColor: '#00BCD4', borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 }
});
