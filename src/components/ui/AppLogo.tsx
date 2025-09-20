import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, Rect, Text} from 'react-native-svg';

export interface AppLogoProps {
  size?: number;
  color?: string;
  showText?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = 100,
  color = '#FFFFFF',
  showText = false,
}) => {
  const scale = size / 512;
  const centerX = 256;
  const centerY = 256;

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Svg width={size} height={size} viewBox="0 0 512 512">
        {/* Background Circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={240}
          fill="#1A1A1A"
          stroke="#333333"
          strokeWidth="8"
        />

        {/* Camera Body */}
        <Rect
          x={140}
          y={200}
          width={232}
          height={112}
          rx={20}
          fill="#2D2D2D"
        />

        {/* Camera Lens */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={48}
          fill="#1A1A1A"
          stroke="#666666"
          strokeWidth="4"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={32}
          fill="#333333"
        />
        <Circle
          cx={centerX}
          cy={centerY}
          r={20}
          fill="#1A1A1A"
        />

        {/* Lens Reflection */}
        <Circle
          cx={248}
          cy={248}
          r={8}
          fill="#FFFFFF"
          opacity={0.4}
        />

        {/* Recording Indicator */}
        <Circle
          cx={320}
          cy={220}
          r={6}
          fill="#FF4444"
        />

        {/* Camera Grip */}
        <Rect
          x={160}
          y={280}
          width={32}
          height={60}
          rx={16}
          fill="#2D2D2D"
        />
        <Rect
          x={320}
          y={280}
          width={32}
          height={60}
          rx={16}
          fill="#2D2D2D"
        />

        {/* Brand Text */}
        {showText && (
          <>
            <Text
              x={centerX}
              y={420}
              textAnchor="middle"
              fill={color}
              fontSize="24"
              fontWeight="bold"
              fontFamily="Arial, sans-serif">
              DashCam
            </Text>
            <Text
              x={centerX}
              y={450}
              textAnchor="middle"
              fill="#888888"
              fontSize="16"
              fontFamily="Arial, sans-serif">
              AUTO
            </Text>
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppLogo;
