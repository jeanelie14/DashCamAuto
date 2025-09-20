import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, StatusBar as RNStatusBar, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '../../store/store';
import {setRecording, setLastRecordingPath} from '../../store/slices/cameraSlice';
import {useThemedStyles} from '../../context/ThemeContext';
import CameraView from '../../components/camera/CameraView';
import SpeedDisplay from '../../components/camera/SpeedDisplay';
import SettingsButton from '../../components/camera/SettingsButton';
import StatusBar from '../../components/camera/StatusBar';
import useLocation from '../../hooks/useLocation';
import useSensors from '../../hooks/useSensors';

const HomeCameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cameraState = useSelector((state: RootState) => state.camera);
  const styles = useThemedStyles(createStyles);

  // Hooks
  const {
    speed,
    isGpsActive,
    error: locationError,
    startLocationTracking,
    stopLocationTracking,
  } = useLocation();

  const {
    isDetecting,
    initializeSensors,
    startMonitoring,
    stopMonitoring,
  } = useSensors();

  // État local
  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<string>('00:00');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);

  // Initialiser les services au montage
  useEffect(() => {
    initializeSensors();
    startLocationTracking();
    
    // Simuler le niveau de batterie (dans une vraie app, utiliser react-native-device-info)
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(0, prev - 0.1));
    }, 10000);

    return () => {
      clearInterval(batteryInterval);
      stopLocationTracking();
    };
  }, [initializeSensors, startLocationTracking, stopLocationTracking]);

  // Gestion du temps d'enregistrement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cameraState.isRecording) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setRecordingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      setRecordingTime('00:00');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraState.isRecording]);

  const handleRecordingStart = useCallback(async (path: string) => {
    console.log('Enregistrement démarré:', path);
    setRecordingPath(path);
    dispatch(setRecording(true));
    dispatch(setLastRecordingPath(path));
    
    // Démarrer la surveillance des capteurs
    if (!isDetecting) {
      await startMonitoring();
    }
  }, [dispatch, isDetecting, startMonitoring]);

  const handleRecordingStop = useCallback(async (video: unknown) => {
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
  }, [dispatch, isDetecting, stopMonitoring]);

  const handleError = useCallback((error: string) => {
    console.error('Erreur caméra:', error);
    Alert.alert('Erreur', error, [{text: 'OK', style: 'default'}]);
  }, []);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings' as never);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Caméra principale */}
      <View style={styles.cameraContainer}>
        <CameraView
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
          onError={handleError}
        />
      </View>

      {/* Overlay de vitesse (haut gauche) */}
      <SpeedDisplay speed={speed} isGpsActive={isGpsActive} />

      {/* Bouton paramètres (haut droite) */}
      <SettingsButton onPress={handleSettingsPress} />

      {/* Barre d'état (bas) */}
      <StatusBar
        isRecording={cameraState.isRecording}
        isGpsActive={isGpsActive}
        batteryLevel={batteryLevel}
        recordingTime={recordingTime}
      />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    cameraContainer: {
      flex: 1,
    },
  });

export default HomeCameraScreen;
