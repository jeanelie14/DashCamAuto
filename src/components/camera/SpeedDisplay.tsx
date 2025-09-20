import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemedStyles} from '../../context/ThemeContext';

interface SpeedDisplayProps {
  speed: number; // en km/h
  isGpsActive: boolean;
}

const SpeedDisplay: React.FC<SpeedDisplayProps> = ({speed, isGpsActive}) => {
  const styles = useThemedStyles(createStyles);

  const formatSpeed = (speedValue: number): string => {
    return Math.round(speedValue).toString().padStart(3, '0');
  };

  return (
    <View style={styles.container}>
      <View style={styles.speedContainer}>
        <Text style={styles.speedValue}>{formatSpeed(speed)}</Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>
      <View style={styles.gpsIndicator}>
        <View style={[styles.gpsDot, {opacity: isGpsActive ? 1 : 0.3}]} />
        <Text style={styles.gpsText}>GPS</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 10,
    },
    speedContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 12,
      alignItems: 'center',
      minWidth: 120,
    },
    speedValue: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#00FF88', // Vert vif pour la vitesse
      fontFamily: 'monospace',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
    },
    speedUnit: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600',
      marginTop: -4,
    },
    gpsIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    gpsDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00FF88',
      marginRight: 6,
    },
    gpsText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

export default SpeedDisplay;
