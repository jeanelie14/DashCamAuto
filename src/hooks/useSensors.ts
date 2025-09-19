import {useEffect, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SensorService, {IncidentEvent} from '../services/SensorService';
import CircularBufferService from '../services/CircularBufferService';
import LocationService from '../services/LocationService';
import {
  addSensorIncident,
  updateSensorData,
  setDetecting,
  setError,
  setIncidentProcessing,
} from '../store/slices/incidentSlice';
import {RootState} from '../store/store';
import Logger from '../utils/Logger';

export const useSensors = () => {
  const dispatch = useDispatch();
  const {isDetecting, sensorConfig} = useSelector((state: RootState) => state.incident);
  const isInitialized = useRef(false);

  /**
   * Initialise les services de capteurs
   */
  const initializeSensors = useCallback(async () => {
    try {
      if (isInitialized.current) return true;

      Logger.info('SENSORS_HOOK', 'Initialisation des capteurs');
      
      // Initialiser les services
      const sensorInit = await SensorService.initialize();
      const bufferInit = await CircularBufferService.initialize();
      const locationInit = await LocationService.getCurrentPosition();

      if (!sensorInit || !bufferInit) {
        throw new Error('Échec de l\'initialisation des services');
      }

      isInitialized.current = true;
      Logger.info('SENSORS_HOOK', 'Capteurs initialisés avec succès');
      return true;
    } catch (error) {
      Logger.error('SENSORS_HOOK', 'Erreur lors de l\'initialisation', error);
      dispatch(setError('Erreur lors de l\'initialisation des capteurs'));
      return false;
    }
  }, [dispatch]);

  /**
   * Démarre la surveillance des capteurs
   */
  const startMonitoring = useCallback(async () => {
    try {
      if (!isInitialized.current) {
        const initialized = await initializeSensors();
        if (!initialized) return false;
      }

      if (isDetecting) {
        Logger.warn('SENSORS_HOOK', 'La surveillance est déjà active');
        return true;
      }

      // Mettre à jour la configuration des capteurs
      SensorService.updateConfig(sensorConfig);

      // Démarrer l'enregistrement en buffer circulaire
      await CircularBufferService.startRecording();

      // Démarrer la surveillance des capteurs
      const started = SensorService.startMonitoring((incident: IncidentEvent) => {
        handleIncidentDetected(incident);
      });

      if (started) {
        dispatch(setDetecting(true));
        Logger.info('SENSORS_HOOK', 'Surveillance démarrée');
        return true;
      } else {
        throw new Error('Impossible de démarrer la surveillance');
      }
    } catch (error) {
      Logger.error('SENSORS_HOOK', 'Erreur lors du démarrage de la surveillance', error);
      dispatch(setError('Erreur lors du démarrage de la surveillance'));
      return false;
    }
  }, [dispatch, isDetecting, sensorConfig, initializeSensors]);

  /**
   * Arrête la surveillance des capteurs
   */
  const stopMonitoring = useCallback(async () => {
    try {
      if (!isDetecting) {
        Logger.warn('SENSORS_HOOK', 'La surveillance n\'est pas active');
        return true;
      }

      // Arrêter la surveillance des capteurs
      SensorService.stopMonitoring();
      
      // Arrêter l'enregistrement en buffer circulaire
      await CircularBufferService.stopRecording();

      dispatch(setDetecting(false));
      Logger.info('SENSORS_HOOK', 'Surveillance arrêtée');
      return true;
    } catch (error) {
      Logger.error('SENSORS_HOOK', 'Erreur lors de l\'arrêt de la surveillance', error);
      dispatch(setError('Erreur lors de l\'arrêt de la surveillance'));
      return false;
    }
  }, [dispatch, isDetecting]);

  /**
   * Gère un incident détecté
   */
  const handleIncidentDetected = useCallback(async (incident: IncidentEvent) => {
    try {
      Logger.info('SENSORS_HOOK', `Incident détecté: ${incident.type} (${incident.severity})`);

      // Obtenir la localisation actuelle
      const location = LocationService.getCurrentLocation();

      // Marquer le segment actuel comme incident
      await CircularBufferService.markSegmentAsIncident(
        incident.id,
        location || undefined
      );

      // Ajouter l'incident au store Redux
      dispatch(addSensorIncident({
        type: incident.type,
        severity: incident.severity,
        sensorData: {
          accelerometer: incident.acceleration,
          gyroscope: incident.gyroscope,
        },
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
        } : undefined,
      }));

      // Marquer l'incident comme en cours de traitement
      dispatch(setIncidentProcessing({
        incidentId: incident.id,
        isProcessing: true,
        progress: 0,
      }));

      // Simuler le traitement de l'incident
      setTimeout(() => {
        dispatch(setIncidentProcessing({
          incidentId: incident.id,
          isProcessing: false,
          progress: 100,
        }));
      }, 2000);

    } catch (error) {
      Logger.error('SENSORS_HOOK', 'Erreur lors du traitement de l\'incident', error);
      dispatch(setError('Erreur lors du traitement de l\'incident'));
    }
  }, [dispatch]);

  /**
   * Met à jour les données des capteurs dans le store
   */
  const updateSensorDataInStore = useCallback(() => {
    const sensorData = SensorService.getRecentData();
    dispatch(updateSensorData(sensorData));
  }, [dispatch]);

  /**
   * Obtient les statistiques du buffer
   */
  const getBufferStats = useCallback(() => {
    return CircularBufferService.getBufferStats();
  }, []);

  /**
   * Obtient les segments d'incident
   */
  const getIncidentSegments = useCallback(() => {
    return CircularBufferService.getIncidentSegments();
  }, []);

  /**
   * Met à jour la configuration des capteurs
   */
  const updateSensorConfigCallback = useCallback((newConfig: Partial<IncidentDetectionConfig>) => {
    dispatch(updateSensorConfig(newConfig));
    SensorService.updateConfig(newConfig);
  }, [dispatch]);

  // Effet pour mettre à jour les données des capteurs périodiquement
  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(() => {
      updateSensorDataInStore();
    }, 1000); // Mise à jour toutes les secondes

    return () => clearInterval(interval);
  }, [isDetecting, updateSensorDataInStore]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (isDetecting) {
        stopMonitoring();
      }
    };
  }, [isDetecting, stopMonitoring]);

  return {
    // État
    isDetecting,
    sensorConfig,
    isInitialized: isInitialized.current,
    
    // Actions
    initializeSensors,
    startMonitoring,
    stopMonitoring,
    updateSensorConfig: updateSensorConfigCallback,
    
    // Données
    getBufferStats,
    getIncidentSegments,
    updateSensorDataInStore,
  };
};

export default useSensors;
