import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemedStyles} from '../../context/ThemeContext';

interface StatusBarProps {
  isRecording: boolean;
  isGpsActive: boolean;
  batteryLevel: number;
  recordingTime?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isRecording,
  isGpsActive,
  batteryLevel,
  recordingTime = '00:00',
}) => {
  const styles = useThemedStyles(createStyles);

  const getBatteryColor = (level: number): string => {
    if (level > 50) return '#00FF88';
    if (level > 20) return '#FFAA00';
    return '#FF4444';
  };

  const formatBatteryLevel = (level: number): string => {
    return `${Math.round(level)}%`;
  };

  return (
    <View style={styles.container}>
      {/* Indicateur d'enregistrement */}
      <View style={styles.recordingContainer}>
        <View style={[styles.recordingDot, {backgroundColor: isRecording ? '#FF4444' : '#666666'}]} />
        <Text style={styles.recordingText}>
          {isRecording ? 'REC' : 'STOP'}
        </Text>
        {isRecording && (
          <Text style={styles.recordingTime}>{recordingTime}</Text>
        )}
      </View>

      {/* Indicateur GPS */}
      <View style={styles.gpsContainer}>
        <View style={[styles.gpsDot, {opacity: isGpsActive ? 1 : 0.3}]} />
        <Text style={styles.gpsText}>GPS</Text>
      </View>

      {/* Indicateur de batterie */}
      <View style={styles.batteryContainer}>
        <Text style={styles.batteryText}>🔋</Text>
        <Text style={[styles.batteryLevel, {color: getBatteryColor(batteryLevel)}]}>
          {formatBatteryLevel(batteryLevel)}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 12,
      zIndex: 10,
    },
    recordingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    recordingDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    recordingText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginRight: 8,
    },
    recordingTime: {
      fontSize: 14,
      color: '#FFFFFF',
      fontFamily: 'monospace',
    },
    gpsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    gpsDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00FF88',
      marginRight: 6,
    },
    gpsText: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    batteryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
    },
    batteryText: {
      fontSize: 16,
      marginRight: 6,
    },
    batteryLevel: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'monospace',
    },
  });

export default StatusBar;
