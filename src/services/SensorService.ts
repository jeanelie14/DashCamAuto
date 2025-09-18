import {accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes} from 'react-native-sensors';
import Logger from '../utils/Logger';

export interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface IncidentDetectionConfig {
  accelerationThreshold: number; // m/s²
  gyroscopeThreshold: number; // rad/s
  timeWindow: number; // ms
  minIncidentDuration: number; // ms
  bufferSize: number; // number of samples to keep
}

export interface IncidentEvent {
  id: string;
  type: 'collision' | 'hard_brake' | 'sharp_turn' | 'acceleration' | 'movement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  duration: number;
  acceleration: SensorData;
  gyroscope: SensorData;
  location?: {
    latitude: number;
    longitude: number;
  };
}

class SensorService {
  private static instance: SensorService;
  private accelerometerSubscription: any = null;
  private gyroscopeSubscription: any = null;
  private isMonitoring = false;
  private incidentCallback: ((incident: IncidentEvent) => void) | null = null;
  
  // Data buffers
  private accelerometerBuffer: SensorData[] = [];
  private gyroscopeBuffer: SensorData[] = [];
  
  // Configuration
  private config: IncidentDetectionConfig = {
    accelerationThreshold: 2.5, // 2.5 m/s² threshold
    gyroscopeThreshold: 1.0, // 1.0 rad/s threshold
    timeWindow: 2000, // 2 seconds
    minIncidentDuration: 100, // 100ms minimum
    bufferSize: 100, // Keep last 100 samples
  };

  public static getInstance(): SensorService {
    if (!SensorService.instance) {
      SensorService.instance = new SensorService();
    }
    return SensorService.instance;
  }

  /**
   * Initialise le service de capteurs
   */
  async initialize(): Promise<boolean> {
    try {
      Logger.info('SENSORS', 'Initialisation du service de capteurs');
      
      // Configurer l'intervalle de mise à jour (50ms = 20Hz)
      setUpdateIntervalForType(SensorTypes.accelerometer, 50);
      setUpdateIntervalForType(SensorTypes.gyroscope, 50);
      
      Logger.info('SENSORS', 'Service de capteurs initialisé avec succès');
      return true;
    } catch (error) {
      Logger.error('SENSORS', 'Erreur lors de l\'initialisation des capteurs', error);
      return false;
    }
  }

  /**
   * Démarre la surveillance des capteurs
   */
  startMonitoring(callback: (incident: IncidentEvent) => void): boolean {
    try {
      if (this.isMonitoring) {
        Logger.warn('SENSORS', 'La surveillance est déjà active');
        return true;
      }

      this.incidentCallback = callback;
      this.isMonitoring = true;

      // Démarrer l'accéléromètre
      this.accelerometerSubscription = accelerometer.subscribe({
        next: (data) => this.handleAccelerometerData(data),
        error: (error) => Logger.error('SENSORS', 'Erreur accéléromètre', error),
      });

      // Démarrer le gyroscope
      this.gyroscopeSubscription = gyroscope.subscribe({
        next: (data) => this.handleGyroscopeData(data),
        error: (error) => Logger.error('SENSORS', 'Erreur gyroscope', error),
      });

      Logger.info('SENSORS', 'Surveillance des capteurs démarrée');
      return true;
    } catch (error) {
      Logger.error('SENSORS', 'Erreur lors du démarrage de la surveillance', error);
      return false;
    }
  }

  /**
   * Arrête la surveillance des capteurs
   */
  stopMonitoring(): void {
    try {
      if (this.accelerometerSubscription) {
        this.accelerometerSubscription.unsubscribe();
        this.accelerometerSubscription = null;
      }

      if (this.gyroscopeSubscription) {
        this.gyroscopeSubscription.unsubscribe();
        this.gyroscopeSubscription = null;
      }

      this.isMonitoring = false;
      this.incidentCallback = null;
      this.clearBuffers();

      Logger.info('SENSORS', 'Surveillance des capteurs arrêtée');
    } catch (error) {
      Logger.error('SENSORS', 'Erreur lors de l\'arrêt de la surveillance', error);
    }
  }

  /**
   * Traite les données de l'accéléromètre
   */
  private handleAccelerometerData(data: any): void {
    const sensorData: SensorData = {
      x: data.x,
      y: data.y,
      z: data.z,
      timestamp: Date.now(),
    };

    this.addToBuffer(this.accelerometerBuffer, sensorData);
    this.detectIncidents();
  }

  /**
   * Traite les données du gyroscope
   */
  private handleGyroscopeData(data: any): void {
    const sensorData: SensorData = {
      x: data.x,
      y: data.y,
      z: data.z,
      timestamp: Date.now(),
    };

    this.addToBuffer(this.gyroscopeBuffer, sensorData);
  }

  /**
   * Ajoute une donnée au buffer circulaire
   */
  private addToBuffer(buffer: SensorData[], data: SensorData): void {
    buffer.push(data);
    
    // Maintenir la taille du buffer
    if (buffer.length > this.config.bufferSize) {
      buffer.shift();
    }
  }

  /**
   * Détecte les incidents basés sur les données des capteurs
   */
  private detectIncidents(): void {
    if (this.accelerometerBuffer.length < 10) {
      return; // Pas assez de données
    }

    const recentAccel = this.accelerometerBuffer.slice(-10); // 10 dernières mesures
    const recentGyro = this.gyroscopeBuffer.slice(-10);

    // Calculer l'accélération totale (magnitude du vecteur)
    const totalAcceleration = Math.sqrt(
      recentAccel[recentAccel.length - 1].x ** 2 +
      recentAccel[recentAccel.length - 1].y ** 2 +
      recentAccel[recentAccel.length - 1].z ** 2
    );

    // Calculer la vitesse angulaire totale
    const totalGyroscope = recentGyro.length > 0 ? Math.sqrt(
      recentGyro[recentGyro.length - 1].x ** 2 +
      recentGyro[recentGyro.length - 1].y ** 2 +
      recentGyro[recentGyro.length - 1].z ** 2
    ) : 0;

    // Détecter les types d'incidents
    this.detectCollision(totalAcceleration, recentAccel[recentAccel.length - 1]);
    this.detectHardBrake(recentAccel);
    this.detectSharpTurn(totalGyroscope, recentGyro[recentGyro.length - 1] || recentAccel[recentAccel.length - 1]);
    this.detectSuddenAcceleration(recentAccel);
  }

  /**
   * Détecte une collision basée sur l'accélération
   */
  private detectCollision(acceleration: number, data: SensorData): void {
    if (acceleration > this.config.accelerationThreshold * 2) {
      this.createIncident({
        type: 'collision',
        severity: acceleration > this.config.accelerationThreshold * 4 ? 'critical' : 'high',
        acceleration: data,
        gyroscope: this.gyroscopeBuffer[this.gyroscopeBuffer.length - 1] || data,
      });
    }
  }

  /**
   * Détecte un freinage brusque
   */
  private detectHardBrake(accelData: SensorData[]): void {
    if (accelData.length < 3) return;

    const current = accelData[accelData.length - 1];
    const previous = accelData[accelData.length - 2];
    const beforePrevious = accelData[accelData.length - 3];

    // Détecter une décélération brusque (freinage)
    const deceleration = current.y - previous.y;
    const previousDeceleration = previous.y - beforePrevious.y;

    if (deceleration < -this.config.accelerationThreshold && 
        previousDeceleration < -this.config.accelerationThreshold * 0.5) {
      this.createIncident({
        type: 'hard_brake',
        severity: Math.abs(deceleration) > this.config.accelerationThreshold * 1.5 ? 'high' : 'medium',
        acceleration: current,
        gyroscope: this.gyroscopeBuffer[this.gyroscopeBuffer.length - 1] || current,
      });
    }
  }

  /**
   * Détecte un virage serré
   */
  private detectSharpTurn(gyroMagnitude: number, data: SensorData): void {
    if (gyroMagnitude > this.config.gyroscopeThreshold * 2) {
      this.createIncident({
        type: 'sharp_turn',
        severity: gyroMagnitude > this.config.gyroscopeThreshold * 3 ? 'high' : 'medium',
        acceleration: this.accelerometerBuffer[this.accelerometerBuffer.length - 1] || data,
        gyroscope: data,
      });
    }
  }

  /**
   * Détecte une accélération soudaine
   */
  private detectSuddenAcceleration(accelData: SensorData[]): void {
    if (accelData.length < 3) return;

    const current = accelData[accelData.length - 1];
    const previous = accelData[accelData.length - 2];

    const acceleration = current.y - previous.y;

    if (acceleration > this.config.accelerationThreshold) {
      this.createIncident({
        type: 'acceleration',
        severity: acceleration > this.config.accelerationThreshold * 1.5 ? 'medium' : 'low',
        acceleration: current,
        gyroscope: this.gyroscopeBuffer[this.gyroscopeBuffer.length - 1] || current,
      });
    }
  }

  /**
   * Crée un événement d'incident
   */
  private createIncident(data: {
    type: IncidentEvent['type'];
    severity: IncidentEvent['severity'];
    acceleration: SensorData;
    gyroscope: SensorData;
  }): void {
    const incident: IncidentEvent = {
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: data.type,
      severity: data.severity,
      timestamp: Date.now(),
      duration: this.config.minIncidentDuration,
      acceleration: data.acceleration,
      gyroscope: data.gyroscope,
    };

    Logger.info('SENSORS', `Incident détecté: ${data.type} (${data.severity})`);
    
    if (this.incidentCallback) {
      this.incidentCallback(incident);
    }
  }

  /**
   * Met à jour la configuration de détection
   */
  updateConfig(newConfig: Partial<IncidentDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    Logger.info('SENSORS', 'Configuration mise à jour', this.config);
  }

  /**
   * Obtient la configuration actuelle
   */
  getConfig(): IncidentDetectionConfig {
    return { ...this.config };
  }

  /**
   * Obtient les données récentes des capteurs
   */
  getRecentData(): {
    accelerometer: SensorData[];
    gyroscope: SensorData[];
  } {
    return {
      accelerometer: [...this.accelerometerBuffer],
      gyroscope: [...this.gyroscopeBuffer],
    };
  }

  /**
   * Vide les buffers de données
   */
  private clearBuffers(): void {
    this.accelerometerBuffer = [];
    this.gyroscopeBuffer = [];
  }

  /**
   * Vérifie si la surveillance est active
   */
  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    this.stopMonitoring();
    this.clearBuffers();
  }
}

export default SensorService.getInstance();
