import {useState, useEffect, useCallback} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {updateLocation, updateSpeed} from '../store/slices/locationSlice';

interface LocationData {
  latitude: number;
  longitude: number;
  speed: number; // en m/s
  accuracy: number;
  timestamp: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  speed: number; // en km/h
  isGpsActive: boolean;
  error: string | null;
  requestLocationPermission: () => Promise<boolean>;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
}

const useLocation = (): UseLocationReturn => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [speed, setSpeed] = useState<number>(0);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'DashCam Auto a besoin d\'accéder à votre localisation pour calculer la vitesse.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }, []);

  const startLocationTracking = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Permission de localisation refusée');
        return;
      }

      setError(null);
      setIsGpsActive(true);

      const id = Geolocation.watchPosition(
        (position) => {
          const {latitude, longitude, speed: speedMs, accuracy} = position.coords;
          const speedKmh = speedMs ? (speedMs * 3.6) : 0; // Conversion m/s vers km/h
          
          const locationData: LocationData = {
            latitude,
            longitude,
            speed: speedMs || 0,
            accuracy: accuracy || 0,
            timestamp: position.timestamp,
          };

          setLocation(locationData);
          setSpeed(speedKmh);

          // Mettre à jour le store Redux
          dispatch(updateLocation({
            latitude,
            longitude,
            accuracy: accuracy || 0,
            timestamp: position.timestamp,
          }));
          dispatch(updateSpeed(speedKmh));
        },
        (error) => {
          console.error('Erreur de localisation:', error);
          setError(error.message);
          setIsGpsActive(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1, // Mettre à jour chaque mètre
          interval: 1000, // Mettre à jour chaque seconde
          fastestInterval: 500,
        },
      );

      setWatchId(id);
    } catch (err) {
      console.error('Erreur lors du démarrage de la localisation:', err);
      setError('Erreur lors du démarrage de la localisation');
    }
  }, [requestLocationPermission, dispatch]);

  const stopLocationTracking = useCallback(() => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsGpsActive(false);
  }, [watchId]);

  // Nettoyer le watch au démontage
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    speed,
    isGpsActive,
    error,
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
  };
};

export default useLocation;
