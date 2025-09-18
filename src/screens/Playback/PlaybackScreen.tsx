import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigation';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

type PlaybackScreenRouteProp = RouteProp<RootStackParamList, 'Playback'>;

const PlaybackScreen: React.FC = () => {
  const route = useRoute<PlaybackScreenRouteProp>();
  const {incidentId} = route.params;

  const {incidents} = useSelector((state: RootState) => state.incident);
  const {theme} = useSelector((state: RootState) => state.settings);

  const incident = incidents.find(inc => inc.id === incidentId);

  const styles = createStyles(theme);

  if (!incident) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Incident not found</Text>
          <Text style={styles.errorSubtext}>The requested incident could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Playback</Text>
        <Text style={styles.subtitle}>{incident.type}</Text>
      </View>

      <View style={styles.content}>
        {/* Video Player Placeholder */}
        <View style={styles.videoContainer}>
          <Text style={styles.videoPlaceholder}>Video Player</Text>
          <Text style={styles.videoSubtext}>Video: {incident.video.path.split('/').pop()}</Text>
        </View>

        {/* Incident Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Incident Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{incident.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Severity:</Text>
            <Text style={styles.detailValue}>{incident.severity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{new Date(incident.timestamp).toLocaleString()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>
              {incident.location.address ||
                `${incident.location.latitude.toFixed(4)}, ${incident.location.longitude.toFixed(4)}`}
            </Text>
          </View>

          {incident.metadata.speed && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Speed:</Text>
              <Text style={styles.detailValue}>{incident.metadata.speed} km/h</Text>
            </View>
          )}

          {incident.metadata.gForce && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>G-Force:</Text>
              <Text style={styles.detailValue}>{incident.metadata.gForce}g</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: 'light' | 'dark' | 'auto') => {
  const isDark = theme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f5f5f5',
    },
    header: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#666666',
      marginTop: 5,
      textTransform: 'capitalize',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    videoContainer: {
      backgroundColor: isDark ? '#1a1a1a' : '#e0e0e0',
      height: 200,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 2,
      borderColor: isDark ? '#333333' : '#cccccc',
      borderStyle: 'dashed',
    },
    videoPlaceholder: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    videoSubtext: {
      fontSize: 14,
      color: isDark ? '#999999' : '#666666',
      marginTop: 10,
    },
    detailsContainer: {
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    detailsTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 15,
      color: isDark ? '#ffffff' : '#000000',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    detailLabel: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#666666',
      fontWeight: '500',
    },
    detailValue: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: '600',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 10,
    },
    actionButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    errorText: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 10,
    },
    errorSubtext: {
      fontSize: 16,
      color: isDark ? '#999999' : '#666666',
      textAlign: 'center',
    },
  });
};

export default PlaybackScreen;
