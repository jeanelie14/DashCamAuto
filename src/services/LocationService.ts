import Geolocation from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid} from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

export interface LocationConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  distanceFilter: number;
}

class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private currentLocation: LocationData | null = null;
  private isTracking = false;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Demande les permissions de localisation
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message:
              "Cette app a besoin d'accéder à votre localisation pour enregistrer les métadonnées GPS des vidéos.",
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS gère les permissions via Info.plist
    } catch (error) {
      console.error('Erreur lors de la demande de permission de localisation:', error);
      return false;
    }
  }

  /**
   * Obtient la position actuelle
   */
  async getCurrentPosition(config?: Partial<LocationConfig>): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Permission de localisation refusée');
      }

      const defaultConfig: LocationConfig = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 10,
        ...config,
      };

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              speed: position.coords.speed || undefined,
              heading: position.coords.heading || undefined,
              timestamp: position.timestamp,
            };
            this.currentLocation = locationData;
            resolve(locationData);
          },
          error => {
            console.error('Erreur de géolocalisation:', error);
            reject(error);
          },
          defaultConfig,
        );
      });
    } catch (error) {
      console.error("Erreur lors de l'obtention de la position:", error);
      return null;
    }
  }

  /**
   * Démarre le suivi de la localisation
   */
  async startLocationTracking(
    onLocationUpdate: (location: LocationData) => void,
    config?: Partial<LocationConfig>,
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Permission de localisation refusée');
      }

      if (this.isTracking) {
        console.warn('Le suivi de localisation est déjà actif');
        return true;
      }

      const defaultConfig: LocationConfig = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        distanceFilter: 5,
        ...config,
      };

      this.watchId = Geolocation.watchPosition(
        position => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: position.timestamp,
          };
          this.currentLocation = locationData;
          onLocationUpdate(locationData);
        },
        error => {
          console.error('Erreur de suivi de localisation:', error);
        },
        defaultConfig,
      );

      this.isTracking = true;
      return true;
    } catch (error) {
      console.error('Erreur lors du démarrage du suivi de localisation:', error);
      return false;
    }
  }

  /**
   * Arrête le suivi de la localisation
   */
  stopLocationTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  /**
   * Obtient la dernière position connue
   */
  getCurrentLocation(): LocationData | null {
    return this.currentLocation;
  }

  /**
   * Vérifie si le suivi est actif
   */
  isLocationTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Calcule la distance entre deux points (en mètres)
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Formate la localisation pour l'affichage
   */
  formatLocation(location: LocationData): string {
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  /**
   * Formate la vitesse pour l'affichage
   */
  formatSpeed(location: LocationData): string {
    if (location.speed === undefined) {
      return 'N/A';
    }
    const speedKmh = (location.speed * 3.6).toFixed(1);
    return `${speedKmh} km/h`;
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    this.stopLocationTracking();
    this.currentLocation = null;
  }
}

export default LocationService.getInstance();
