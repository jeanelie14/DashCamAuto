
import {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {
  setRecording,
  setCurrentRecordingPath,
  setLastRecordingPath,
  setError as setCameraError,
  setInitialized,
  setPermission,
} from '../store/slices/cameraSlice';
import CameraService from '../services/CameraService';
import PermissionService from '../services/PermissionService';
import LocationService from '../services/LocationService';
import StorageService, {VideoMetadata} from '../services/StorageService';

export interface UseCameraReturn {
  isRecording: boolean;
  isInitialized: boolean;
  hasPermission: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  switchCamera: () => Promise<void>;
  setZoom: (zoom: number) => Promise<void>;
  setFlash: (flash: 'on' | 'off' | 'auto') => Promise<void>;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialise la caméra et les services
   */
  const initialize = useCallback(async () => {
    try {
      setError(null);

      // Vérifier les permissions
      const permissions = await PermissionService.requestAllPermissions();
      setHasPermission(permissions.camera && permissions.microphone);
      dispatch(setPermission(permissions.camera && permissions.microphone));

      if (!permissions.camera || !permissions.microphone) {
        throw new Error('Permissions caméra et microphone requises');
      }

      // Initialiser les services
      const cameraInitialized = await CameraService.initialize();
      if (!cameraInitialized) {
        throw new Error("Impossible d'initialiser la caméra");
      }

      // Démarrer le suivi de localisation
      await LocationService.startLocationTracking(
        location => {
          console.log('Localisation mise à jour:', location);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
        },
      );

      setIsInitialized(true);
      dispatch(setInitialized(true));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'initialisation";
      setError(errorMessage);
      dispatch(setCameraError(errorMessage));
    }
  }, [dispatch]);

  /**
   * Démarre l'enregistrement
   */
  const startRecording = useCallback(async () => {
    try {
      if (isRecording) {
        return;
      }

      setError(null);

      const recordingPath = await CameraService.startRecording({
        quality: 'high',
        codec: 'h264',
        audio: true,
        location: true,
      });

      if (recordingPath) {
        setIsRecording(true);
        dispatch(setRecording(true));
        dispatch(setCurrentRecordingPath(recordingPath));
      } else {
        throw new Error("Impossible de démarrer l'enregistrement");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'enregistrement";
      setError(errorMessage);
      dispatch(setCameraError(errorMessage));
    }
  }, [isRecording, dispatch]);

  /**
   * Arrête l'enregistrement
   */
  const stopRecording = useCallback(async () => {
    try {
      if (!isRecording) {
        return;
      }

      setError(null);

      const videoFile = await CameraService.stopRecording();
      if (videoFile) {
        // Sauvegarder la vidéo avec métadonnées
        const location = LocationService.getCurrentLocation();
        const metadata: Omit<VideoMetadata, 'path' | 'filename'> = {
          size: videoFile.size,
          duration: videoFile.duration,
          timestamp: videoFile.timestamp,
          location: location || undefined,
          resolution: '1080p',
          fps: 30,
          codec: 'h264',
        };

        const savedVideo = await StorageService.saveVideo(videoFile.path, metadata);
        if (savedVideo) {
          dispatch(setLastRecordingPath(savedVideo.path));
        }
      }

      setIsRecording(false);
      dispatch(setRecording(false));
      dispatch(setCurrentRecordingPath(null));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'arrêt d'enregistrement";
      setError(errorMessage);
      dispatch(setCameraError(errorMessage));
    }
  }, [isRecording, dispatch]);

  /**
   * Change de caméra
   */
  const switchCamera = useCallback(async () => {
    try {
      await CameraService.switchCamera();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de changement de caméra';
      setError(errorMessage);
      dispatch(setCameraError(errorMessage));
    }
  }, [dispatch]);

  /**
   * Configure le zoom
   */
  const setZoom = useCallback(
    async (zoom: number) => {
      try {
        await CameraService.setZoom(zoom);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de configuration du zoom';
        setError(errorMessage);
        dispatch(setCameraError(errorMessage));
      }
    },
    [dispatch],
  );

  /**
   * Configure le flash
   */
  const setFlash = useCallback(
    async (flash: 'on' | 'off' | 'auto') => {
      try {
        await CameraService.setFlash(flash);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur de configuration du flash';
        setError(errorMessage);
        dispatch(setCameraError(errorMessage));
      }
    },
    [dispatch],
  );

  /**
   * Nettoie les ressources
   */
  const cleanup = useCallback(() => {
    LocationService.stopLocationTracking();
    CameraService.cleanup();
    StorageService.cleanup();
  }, []);

  // Initialiser au montage
  useEffect(() => {
    initialize();

    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  return {
    isRecording,
    isInitialized,
    hasPermission,
    error,
    startRecording,
    stopRecording,
    switchCamera,
    setZoom,
    setFlash,
    initialize,
    cleanup,
  };
};
