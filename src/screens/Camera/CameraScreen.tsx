import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store';
import {setRecording, setLastRecordingPath} from '../../store/slices/cameraSlice';
import {useThemedStyles} from '../../context/ThemeContext';
import {Card, Button} from '../../components/ui';
import CameraView from '../../components/camera/CameraView';
import useSensors from '../../hooks/useSensors';

const CameraScreen: React.FC = () => {
  const dispatch = useDispatch();
  const cameraState = useSelector((state: RootState) => state.camera);
  const incidentState = useSelector((state: RootState) => state.incident);
  const styles = useThemedStyles(createStyles);

  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  
  // Hook pour la gestion des capteurs
  const {
    isDetecting,
    sensorConfig,
    initializeSensors,
    startMonitoring,
    stopMonitoring,
    getBufferStats,
  } = useSensors();

  // Initialiser les capteurs au montage du composant
  useEffect(() => {
    initializeSensors();
  }, [initializeSensors]);

  const handleRecordingStart = async (path: string) => {
    console.log('Enregistrement démarré:', path);
    setRecordingPath(path);
    dispatch(setRecording(true));
    dispatch(setLastRecordingPath(path));
    
    // Démarrer la surveillance des capteurs
    if (!isDetecting) {
      await startMonitoring();
    }
  };

  const handleRecordingStop = async (video: unknown) => {
    console.log('Enregistrement arrêté:', video);
    setRecordingPath(null);
    dispatch(setRecording(false));
    
    // Arrêter la surveillance des capteurs
    if (isDetecting) {
      await stopMonitoring();
    }

    Alert.alert('Enregistrement terminé', `Vidéo sauvegardée: ${(video as any).path}`, [
      {text: 'OK', style: 'default'},
    ]);
  };

  const handleError = (error: string) => {
    console.error('Erreur caméra:', error);
    Alert.alert('Erreur', error, [{text: 'OK', style: 'default'}]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DashCam Auto</Text>
        <Text style={styles.subtitle}>
          {cameraState.isRecording ? 'Enregistrement en cours...' : 'Prêt à enregistrer'}
        </Text>
      </View>

      {/* Composant Camera principal */}
      <View style={styles.cameraContainer}>
        <CameraView
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
          onError={handleError}
        />
      </View>

      {/* Informations de statut */}
      <View style={styles.statusContainer}>
        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>Statut de l'enregistrement</Text>
          <Text style={styles.statusText}>
            {cameraState.isRecording ? '🔴 Enregistrement actif' : '⏸️ En pause'}
          </Text>
          {recordingPath && (
            <Text style={styles.pathText}>Fichier: {recordingPath.split('/').pop()}</Text>
          )}
        </Card>

        {/* Statut de détection d'incidents */}
        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>Détection d'incidents</Text>
          <Text style={styles.statusText}>
            {isDetecting ? '🟢 Surveillance active' : '🔴 Surveillance inactive'}
          </Text>
          <Text style={styles.statusText}>
            Incidents détectés: {incidentState.incidents.length}
          </Text>
          {incidentState.lastIncident && (
            <Text style={styles.incidentText}>
              Dernier: {incidentState.lastIncident.type} ({incidentState.lastIncident.severity})
            </Text>
          )}
        </Card>

        {/* Contrôles de surveillance */}
        <View style={styles.controlsContainer}>
          <Button
            title={isDetecting ? 'Arrêter surveillance' : 'Démarrer surveillance'}
            onPress={isDetecting ? stopMonitoring : startMonitoring}
            variant={isDetecting ? 'danger' : 'primary'}
            style={styles.controlButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing[4],
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing[1],
    },
    cameraContainer: {
      flex: 1,
      margin: theme.spacing[2],
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    statusContainer: {
      padding: theme.spacing[4],
    },
    statusCard: {
      padding: theme.spacing[4],
    },
    statusTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing[2],
    },
    statusText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing[1],
    },
    pathText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textTertiary,
      fontFamily: 'monospace',
    },
    incidentText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.warning,
      fontWeight: theme.typography.fontWeight.medium,
      marginTop: theme.spacing[1],
    },
    controlsContainer: {
      marginTop: theme.spacing[4],
      alignItems: 'center',
    },
    controlButton: {
      minWidth: 200,
    },
  });

export default CameraScreen;
