import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import {useThemedStyles} from '../../context/ThemeContext';
import {Button, Icon} from '../ui';
import {useCamera} from '../../hooks/useCamera';

export interface CameraViewProps {
  onRecordingStart?: (path: string) => void;
  onRecordingStop?: (video: unknown) => void;
  onError?: (error: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({onRecordingStart, onRecordingStop, onError}) => {
  const styles = useThemedStyles(createStyles);
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [currentDevice, setCurrentDevice] = useState(devices.back || null);
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
  const [zoom, setZoom] = useState(1);

  const {
    isRecording,
    error: cameraError,
    startRecording: startCameraRecording,
    stopRecording: stopCameraRecording,
    switchCamera: switchCameraDevice,
    setZoom: setCameraZoom,
    setFlash: setCameraFlash,
  } = useCamera();

  // Vérifier les permissions au montage
  useEffect(() => {
    checkPermissions();
  }, []);

  // Mettre à jour la caméra quand les devices changent
  useEffect(() => {
    if (devices.back && !currentDevice) {
      setCurrentDevice(devices.back);
    }
  }, [devices, currentDevice]);

  const checkPermissions = async () => {
    try {
      const permission = await Camera.getCameraPermissionStatus();
      setCameraPermission(permission);

      if (permission !== 'authorized') {
        const newPermission = await Camera.requestCameraPermission();
        setCameraPermission(newPermission);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      onError?.('Erreur de permission caméra');
    }
  };

  const handleStartRecording = async () => {
    try {
      await startCameraRecording();
      onRecordingStart?.('Recording started');
    } catch (error) {
      console.error("Erreur lors du démarrage de l'enregistrement:", error);
      onError?.("Erreur d'enregistrement");
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopCameraRecording();
      onRecordingStop?.({path: 'recording_stopped'});
    } catch (error) {
      console.error("Erreur lors de l'arrêt de l'enregistrement:", error);
      onError?.("Erreur d'arrêt d'enregistrement");
    }
  };

  const handleSwitchCamera = () => {
    if (currentDevice === devices.back) {
      setCurrentDevice(devices.front || null);
    } else {
      setCurrentDevice(devices.back || null);
    }
    switchCameraDevice();
  };

  const handleToggleFlash = () => {
    const newFlash = flash === 'off' ? 'auto' : flash === 'auto' ? 'on' : 'off';
    setFlash(newFlash);
    setCameraFlash(newFlash);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.5, 5);
    setZoom(newZoom);
    setCameraZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.5, 1);
    setZoom(newZoom);
    setCameraZoom(newZoom);
  };

  // Frame processor pour l'analyse en temps réel
  const frameProcessor = useFrameProcessor(_frame => {
    'worklet';
    // Ici on peut ajouter l'analyse d'image pour la détection d'incidents
  }, []);

  if (cameraPermission !== 'authorized') {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera" size={64} color={styles.permissionIcon.color} />
        <Text style={styles.permissionTitle}>Permission caméra requise</Text>
        <Text style={styles.permissionText}>
          L'application a besoin d'accéder à la caméra pour enregistrer des vidéos.
        </Text>
        <Button
          title="Autoriser la caméra"
          onPress={checkPermissions}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  if (!currentDevice) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={64} color={styles.errorIcon.color} />
        <Text style={styles.errorTitle}>Caméra non disponible</Text>
        <Text style={styles.errorText}>Aucune caméra n'a été trouvée sur cet appareil.</Text>
      </View>
    );
  }

  if (cameraError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={64} color={styles.errorIcon.color} />
        <Text style={styles.errorTitle}>Erreur caméra</Text>
        <Text style={styles.errorText}>{cameraError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={currentDevice}
        isActive={true}
        video={true}
        audio={true}
        frameProcessor={frameProcessor}
        zoom={zoom}
        enableZoomGesture={true}
        onInitialized={() => {
          if (cameraRef.current) {
            // CameraService.setCameraInstance(cameraRef.current);
          }
        }}
      />

      {/* Overlay de contrôle */}
      <View style={styles.overlay}>
        {/* Contrôles du haut */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleToggleFlash}>
            <Icon name={flash === 'off' ? 'flashOff' : 'flash'} size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleSwitchCamera}>
            <Icon name="switch" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Contrôles du bas */}
        <View style={styles.bottomControls}>
          {/* Zoom */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <Icon name="zoomOut" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.zoomText}>{zoom.toFixed(1)}x</Text>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <Icon name="zoomIn" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bouton d'enregistrement */}
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}>
            <View style={styles.recordButtonInner}>
              {isRecording ? (
                <View style={styles.stopIcon} />
              ) : (
                <Icon name="record" size={32} color="white" />
              )}
            </View>
          </TouchableOpacity>

          {/* Indicateur d'enregistrement */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>REC</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
    },
    topControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    bottomControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 50,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoomControls: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    zoomButton: {
      padding: 10,
    },
    zoomText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginHorizontal: 10,
    },
    recordButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: 'white',
    },
    recordButtonActive: {
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
    },
    recordButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stopIcon: {
      width: 20,
      height: 20,
      backgroundColor: 'red',
      borderRadius: 2,
    },
    recordingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 0, 0, 0.8)',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    recordingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'white',
      marginRight: 8,
    },
    recordingText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    permissionIcon: {
      color: theme.colors.textSecondary,
    },
    permissionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginTop: 20,
      marginBottom: 10,
    },
    permissionText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
    },
    permissionButton: {
      paddingHorizontal: 30,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    errorIcon: {
      color: theme.colors.error,
    },
    errorTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      marginTop: 20,
      marginBottom: 10,
    },
    errorText: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

export default CameraView;
