import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

export default function BackgroundPlayerScreen({ coverUrl }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 200, height: 200 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="90" stroke="#4A5E62" strokeWidth="1" fill="none" />
        <Line x1="100" y1="10" x2="100" y2="190" stroke="#4A5E62" strokeWidth="1" />
        <Line x1="10" y1="100" x2="190" y2="100" stroke="#4A5E62" strokeWidth="1" />
        <Circle cx="100" cy="40" r="2" fill="#FFD700" />
        <Circle cx="40" cy="100" r="2" fill="#FFD700" />
      </Svg>
      <Image source={{ uri: coverUrl || 'https://picsum.photos/200' }} style={{ width: 140, height: 140, position: 'absolute', borderWidth: 3, borderColor: '#FFD700' }} />
    </View>
  );
}
