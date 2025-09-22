import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import LocationService, {LocationData} from './LocationService';
import StorageService from './StorageService';
import Logger from '../utils/Logger';

export interface CameraConfig {
  deviceId?: string;
  resolution: '720p' | '1080p' | '4k';
  fps: number;
  flash: 'on' | 'off' | 'auto';
  zoom: number;
  focus: 'auto' | 'manual';
}

export interface RecordingConfig {
  quality: 'low' | 'medium' | 'high' | 'max';
  bitrate?: number;
  codec: 'h264' | 'h265';
  audio: boolean;
  location: boolean;
}

export interface VideoFile {
  path: string;
  duration: number;
  size: number;
  timestamp: number;
  location?: LocationData;
}

class CameraService {
  private static instance: CameraService;
  private camera: Camera | null = null;
  private isRecording = false;
  private currentRecordingPath: string | null = null;

  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  /**
   * Initialise le service caméra
   */
  async initialize(): Promise<boolean> {
    try {
      Logger.info('CAMERA', 'Initialisation du service caméra');
      
      // Vérifier les permissions
      const hasPermission: CameraPermissionStatus = await Camera.getCameraPermissionStatus();
      if (hasPermission !== 'authorized') {
        Logger.warn('CAMERA', 'Permission caméra non accordée, demande en cours');
        const permission: CameraPermissionStatus = await Camera.requestCameraPermission();
        const isAuthorized = permission === 'authorized';
        
        if (isAuthorized) {
          Logger.info('CAMERA', 'Permission caméra accordée');
        } else {
          Logger.cameraError('Permission caméra refusée', new Error('Permission denied'));
        }
        
        return isAuthorized;
      }

      Logger.info('CAMERA', 'Permission caméra déjà accordée');

      // Initialiser les services de stockage et de localisation
      await StorageService.initialize();
      await LocationService.getCurrentPosition();

      Logger.info('CAMERA', 'Service caméra initialisé avec succès');
      return true;
    } catch (error) {
      Logger.cameraError("Erreur lors de l'initialisation de la caméra", error);
      return false;
    }
  }

  /**
   * Obtient la liste des caméras disponibles
   * Note: Cette méthode sera implémentée dans le composant Camera
   */
  getAvailableCameras() {
    return {
      back: null,
      front: null,
    };
  }

  /**
   * Démarre l'enregistrement vidéo
   */
  async startRecording(config: RecordingConfig): Promise<string | null> {
    try {
      if (!this.camera || this.isRecording) {
        return null;
      }

      const timestamp = Date.now();
      const fileName = `dashcam_${timestamp}.mp4`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const recordingOptions = {
        fileType: 'mp4' as const,
        videoCodec: config.codec,
        videoBitRate: config.bitrate || this.getBitrateForQuality(config.quality),
        audioBitRate: config.audio ? 128000 : 0,
        includeAudio: config.audio,
      };

      await this.camera.startRecording({
        ...recordingOptions,
        onRecordingFinished: video => {
          this.onRecordingFinished(video, config);
        },
        onRecordingError: error => {
          console.error("Erreur d'enregistrement:", error);
          this.isRecording = false;
        },
      });

      this.isRecording = true;
      this.currentRecordingPath = filePath;
      return filePath;
    } catch (error) {
      console.error("Erreur lors du démarrage de l'enregistrement:", error);
      return null;
    }
  }

  /**
   * Arrête l'enregistrement vidéo
   */
  async stopRecording(): Promise<VideoFile | null> {
    try {
      if (!this.camera || !this.isRecording) {
        return null;
      }

      await this.camera.stopRecording();
      this.isRecording = false;

      // Attendre que le fichier soit créé
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      if (this.currentRecordingPath) {
        const fileInfo = await RNFS.stat(this.currentRecordingPath);
        const videoFile: VideoFile = {
          path: this.currentRecordingPath,
          duration: 0, // Sera calculé par le lecteur vidéo
          size: fileInfo.size,
          timestamp: Date.now(),
        };

        this.currentRecordingPath = null;
        return videoFile;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de l'arrêt de l'enregistrement:", error);
      return null;
    }
  }

  /**
   * Obtient la configuration de bitrate selon la qualité
   */
  private getBitrateForQuality(quality: string): number {
    switch (quality) {
      case 'low':
        return 1000000; // 1 Mbps
      case 'medium':
        return 2500000; // 2.5 Mbps
      case 'high':
        return 5000000; // 5 Mbps
      case 'max':
        return 10000000; // 10 Mbps
      default:
        return 2500000;
    }
  }

  /**
   * Callback appelé quand l'enregistrement est terminé
   */
  private async onRecordingFinished(video: unknown, config: RecordingConfig): Promise<void> {
    try {
      console.log('Enregistrement terminé:', video);

      // Ajouter les métadonnées si nécessaire
      if (config.location) {
        const location = LocationService.getCurrentLocation();
        if (location) {
          // Les métadonnées GPS seront ajoutées lors de la sauvegarde
          console.log('Localisation disponible:', location);
        }
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la vidéo:', error);
    }
  }

  /**
   * Change la caméra (avant/arrière)
   */
  async switchCamera(): Promise<boolean> {
    try {
      if (!this.camera) {
        return false;
      }

      // Cette fonctionnalité sera implémentée avec le composant Camera
      return true;
    } catch (error) {
      console.error('Erreur lors du changement de caméra:', error);
      return false;
    }
  }

  /**
   * Configure le zoom
   */
  async setZoom(_zoom: number): Promise<boolean> {
    try {
      if (!this.camera) {
        return false;
      }

      // Le zoom sera géré par le composant Camera
      return true;
    } catch (error) {
      console.error('Erreur lors de la configuration du zoom:', error);
      return false;
    }
  }

  /**
   * Configure le flash
   */
  async setFlash(_flash: 'on' | 'off' | 'auto'): Promise<boolean> {
    try {
      if (!this.camera) {
        return false;
      }

      // Le flash sera géré par le composant Camera
      return true;
    } catch (error) {
      console.error('Erreur lors de la configuration du flash:', error);
      return false;
    }
  }

  /**
   * Obtient l'état de l'enregistrement
   */
  getRecordingState(): boolean {
    return this.isRecording;
  }

  /**
   * Obtient le chemin de l'enregistrement actuel
   */
  getCurrentRecordingPath(): string | null {
    return this.currentRecordingPath;
  }

  /**
   * Sauvegarde une référence à l'instance Camera
   */
  setCameraInstance(camera: Camera): void {
    this.camera = camera;
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    this.camera = null;
    this.isRecording = false;
    this.currentRecordingPath = null;
  }
}

export default CameraService.getInstance();
