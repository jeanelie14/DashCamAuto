import RNFS from 'react-native-fs';
import Logger from '../utils/Logger';
import {VideoFile} from './CameraService';
import {LocationData} from './LocationService';

export interface BufferConfig {
  maxDuration: number; // Duration in milliseconds
  maxSize: number; // Max size in bytes
  segmentDuration: number; // Duration of each segment in milliseconds
  overlapDuration: number; // Overlap between segments in milliseconds
}

export interface BufferSegment {
  id: string;
  path: string;
  startTime: number;
  endTime: number;
  size: number;
  location?: LocationData;
  isIncident: boolean;
  incidentId?: string;
}

class CircularBufferService {
  private static instance: CircularBufferService;
  private segments: BufferSegment[] = [];
  private isRecording = false;
  private currentSegment: BufferSegment | null = null;
  private segmentStartTime = 0;
  private config: BufferConfig = {
    maxDuration: 300000, // 5 minutes
    maxSize: 500 * 1024 * 1024, // 500 MB
    segmentDuration: 30000, // 30 seconds per segment
    overlapDuration: 5000, // 5 seconds overlap
  };

  public static getInstance(): CircularBufferService {
    if (!CircularBufferService.instance) {
      CircularBufferService.instance = new CircularBufferService();
    }
    return CircularBufferService.instance;
  }

  /**
   * Initialise le service de buffer circulaire
   */
  async initialize(): Promise<boolean> {
    try {
      Logger.info('BUFFER', 'Initialisation du service de buffer circulaire');
      
      // Créer le dossier de buffer s'il n'existe pas
      const bufferDir = `${RNFS.DocumentDirectoryPath}/buffer`;
      const exists = await RNFS.exists(bufferDir);
      if (!exists) {
        await RNFS.mkdir(bufferDir);
      }

      // Nettoyer les anciens segments
      await this.cleanupOldSegments();
      
      Logger.info('BUFFER', 'Service de buffer circulaire initialisé');
      return true;
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors de l\'initialisation du buffer', error);
      return false;
    }
  }

  /**
   * Démarre l'enregistrement en buffer circulaire
   */
  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        Logger.warn('BUFFER', 'L\'enregistrement est déjà en cours');
        return true;
      }

      this.isRecording = true;
      this.segmentStartTime = Date.now();
      
      // Créer le premier segment
      await this.createNewSegment();
      
      Logger.info('BUFFER', 'Enregistrement en buffer circulaire démarré');
      return true;
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors du démarrage de l\'enregistrement', error);
      return false;
    }
  }

  /**
   * Arrête l'enregistrement en buffer circulaire
   */
  async stopRecording(): Promise<void> {
    try {
      if (!this.isRecording) {
        return;
      }

      this.isRecording = false;
      
      // Finaliser le segment actuel
      if (this.currentSegment) {
        await this.finalizeCurrentSegment();
      }

      Logger.info('BUFFER', 'Enregistrement en buffer circulaire arrêté');
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors de l\'arrêt de l\'enregistrement', error);
    }
  }

  /**
   * Crée un nouveau segment de buffer
   */
  private async createNewSegment(): Promise<void> {
    try {
      const segmentId = `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const segmentPath = `${RNFS.DocumentDirectoryPath}/buffer/${segmentId}.mp4`;
      
      this.currentSegment = {
        id: segmentId,
        path: segmentPath,
        startTime: this.segmentStartTime,
        endTime: this.segmentStartTime + this.config.segmentDuration,
        size: 0,
        isIncident: false,
      };

      Logger.info('BUFFER', `Nouveau segment créé: ${segmentId}`);
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors de la création du segment', error);
    }
  }

  /**
   * Finalise le segment actuel
   */
  private async finalizeCurrentSegment(): Promise<void> {
    if (!this.currentSegment) return;

    try {
      // Vérifier si le fichier existe et obtenir sa taille
      const exists = await RNFS.exists(this.currentSegment.path);
      if (exists) {
        const stats = await RNFS.stat(this.currentSegment.path);
        this.currentSegment.size = stats.size;
        this.currentSegment.endTime = Date.now();
      }

      // Ajouter le segment à la liste
      this.segments.push(this.currentSegment);
      
      // Nettoyer les anciens segments si nécessaire
      await this.cleanupOldSegments();
      
      Logger.info('BUFFER', `Segment finalisé: ${this.currentSegment.id}`);
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors de la finalisation du segment', error);
    }
  }

  /**
   * Marque un segment comme incident
   */
  async markSegmentAsIncident(incidentId: string, location?: LocationData): Promise<void> {
    if (!this.currentSegment) return;

    try {
      this.currentSegment.isIncident = true;
      this.currentSegment.incidentId = incidentId;
      this.currentSegment.location = location;

      // Créer une copie de sauvegarde du segment d'incident
      const incidentPath = `${RNFS.DocumentDirectoryPath}/incidents/${incidentId}.mp4`;
      const incidentDir = `${RNFS.DocumentDirectoryPath}/incidents`;
      
      // Créer le dossier incidents s'il n'existe pas
      const exists = await RNFS.exists(incidentDir);
      if (!exists) {
        await RNFS.mkdir(incidentDir);
      }

      // Copier le fichier
      if (await RNFS.exists(this.currentSegment.path)) {
        await RNFS.copyFile(this.currentSegment.path, incidentPath);
        Logger.info('BUFFER', `Segment d'incident sauvegardé: ${incidentId}`);
      }
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors de la sauvegarde du segment d\'incident', error);
    }
  }

  /**
   * Obtient les segments d'incident
   */
  getIncidentSegments(): BufferSegment[] {
    return this.segments.filter(segment => segment.isIncident);
  }

  /**
   * Obtient tous les segments
   */
  getAllSegments(): BufferSegment[] {
    return [...this.segments];
  }

  /**
   * Obtient un segment par ID
   */
  getSegmentById(segmentId: string): BufferSegment | undefined {
    return this.segments.find(segment => segment.id === segmentId);
  }

  /**
   * Nettoie les anciens segments selon la configuration
   */
  private async cleanupOldSegments(): Promise<void> {
    try {
      const now = Date.now();
      const maxAge = this.config.maxDuration;
      
      // Calculer la taille totale
      const totalSize = this.segments.reduce((sum, segment) => sum + segment.size, 0);
      
      // Supprimer les segments trop anciens
      const segmentsToDelete = this.segments.filter(segment => 
        now - segment.endTime > maxAge && !segment.isIncident
      );

      // Si on dépasse la taille maximale, supprimer les plus anciens non-incidents
      if (totalSize > this.config.maxSize) {
        const nonIncidentSegments = this.segments
          .filter(segment => !segment.isIncident)
          .sort((a, b) => a.startTime - b.startTime);
        
        let currentSize = totalSize;
        for (const segment of nonIncidentSegments) {
          if (currentSize <= this.config.maxSize) break;
          
          segmentsToDelete.push(segment);
          currentSize -= segment.size;
        }
      }

      // Supprimer les fichiers et retirer des segments
      for (const segment of segmentsToDelete) {
        try {
          if (await RNFS.exists(segment.path)) {
            await RNFS.unlink(segment.path);
          }
        } catch (error) {
          Logger.warn('BUFFER', `Erreur lors de la suppression du segment ${segment.id}`, error);
        }
      }

      // Retirer les segments supprimés de la liste
      this.segments = this.segments.filter(segment => 
        !segmentsToDelete.includes(segment)
      );

      if (segmentsToDelete.length > 0) {
        Logger.info('BUFFER', `${segmentsToDelete.length} segments nettoyés`);
      }
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors du nettoyage des segments', error);
    }
  }

  /**
   * Met à jour la configuration
   */
  updateConfig(newConfig: Partial<BufferConfig>): void {
    this.config = { ...this.config, ...newConfig };
    Logger.info('BUFFER', 'Configuration mise à jour', this.config);
  }

  /**
   * Obtient la configuration actuelle
   */
  getConfig(): BufferConfig {
    return { ...this.config };
  }

  /**
   * Obtient les statistiques du buffer
   */
  getBufferStats(): {
    totalSegments: number;
    incidentSegments: number;
    totalSize: number;
    oldestSegment: number | null;
    newestSegment: number | null;
  } {
    const incidentSegments = this.segments.filter(s => s.isIncident).length;
    const totalSize = this.segments.reduce((sum, s) => sum + s.size, 0);
    const timestamps = this.segments.map(s => s.startTime);
    
    return {
      totalSegments: this.segments.length,
      incidentSegments,
      totalSize,
      oldestSegment: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestSegment: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  }

  /**
   * Vérifie si l'enregistrement est actif
   */
  isRecordingActive(): boolean {
    return this.isRecording;
  }

  /**
   * Nettoie toutes les ressources
   */
  async cleanup(): Promise<void> {
    try {
      await this.stopRecording();
      
      // Supprimer tous les segments
      for (const segment of this.segments) {
        try {
          if (await RNFS.exists(segment.path)) {
            await RNFS.unlink(segment.path);
          }
        } catch (error) {
          Logger.warn('BUFFER', `Erreur lors de la suppression du segment ${segment.id}`, error);
        }
      }
      
      this.segments = [];
      this.currentSegment = null;
      
      Logger.info('BUFFER', 'Service de buffer circulaire nettoyé');
    } catch (error) {
      Logger.error('BUFFER', 'Erreur lors du nettoyage du buffer', error);
    }
  }
}

export default CircularBufferService.getInstance();
