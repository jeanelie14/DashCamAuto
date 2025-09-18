import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store';
import {setRecording} from '../../store/slices/cameraSlice';
import {useThemedStyles} from '../../context/ThemeContext';
import {Button, Card, Icon} from '../../components/ui';
import DebugPanel from '../../components/debug/DebugPanel';

const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {isRecording, lastRecordingPath} = useSelector((state: RootState) => state.camera);
  const {incidents} = useSelector((state: RootState) => state.incident);
  const {currentLocation} = useSelector((state: RootState) => state.location);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const handleToggleRecording = () => {
    dispatch(setRecording(!isRecording));
  };

  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.container}>
      {/* Debug Button */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setShowDebugPanel(true)}>
        <Icon name="bug" size={20} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>DashCam Auto</Text>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>Status</Text>
          <Text style={styles.statusText}>{isRecording ? 'Recording...' : 'Ready'}</Text>
          {lastRecordingPath && (
            <Text style={styles.lastRecording}>
              Last recording: {lastRecordingPath.split('/').pop()}
            </Text>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
            variant={isRecording ? 'danger' : 'primary'}
            onPress={handleToggleRecording}
            leftIcon={<Icon name={isRecording ? 'stop' : 'record'} size={20} color="white" />}
            fullWidth
          />
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Total Incidents:</Text>
            <Text style={styles.statValue}>{incidents.length}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Location:</Text>
            <Text style={styles.statValue}>
              {currentLocation
                ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
                : 'Not available'}
            </Text>
          </View>
        </Card>

        {/* Recent Incidents */}
        {incidents.length > 0 && (
          <Card style={styles.incidentsCard}>
            <Text style={styles.cardTitle}>Recent Incidents</Text>
            {incidents.slice(0, 3).map(incident => (
              <View key={incident.id} style={styles.incidentItem}>
                <Text style={styles.incidentType}>{incident.type}</Text>
                <Text style={styles.incidentTime}>
                  {new Date(incident.timestamp).toLocaleString()}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      {/* Debug Panel */}
      <DebugPanel
        visible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing[5],
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: 'center',
      marginBottom: theme.spacing[8],
      color: theme.colors.text,
    },
    statusCard: {
      marginBottom: theme.spacing[5],
    },
    statusTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
      marginBottom: theme.spacing[3],
      color: theme.colors.text,
    },
    statusText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    lastRecording: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing[1],
    },
    actionsCard: {
      marginBottom: theme.spacing[5],
    },
    cardTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
      marginBottom: theme.spacing[4],
      color: theme.colors.text,
    },
    statsCard: {
      marginBottom: theme.spacing[5],
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[3],
    },
    statLabel: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
    },
    statValue: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text,
    },
    incidentsCard: {
      // No additional styles needed, Card component handles styling
    },
    incidentItem: {
      paddingVertical: theme.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    incidentType: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    incidentTime: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing[1],
    },
    debugButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
  });

export default DashboardScreen;
