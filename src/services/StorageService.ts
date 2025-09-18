import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {LocationData} from './LocationService';

export interface VideoMetadata {
  path: string;
  filename: string;
  size: number;
  duration: number;
  timestamp: number;
  location?: LocationData;
  resolution: string;
  fps: number;
  codec: string;
}

export interface StorageConfig {
  maxSizeGB: number;
  autoDelete: boolean;
  compressionEnabled: boolean;
}

class StorageService {
  private static instance: StorageService;
  private config: StorageConfig = {
    maxSizeGB: 5,
    autoDelete: true,
    compressionEnabled: false,
  };

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Initialise le service de stockage
   */
  async initialize(): Promise<boolean> {
    try {
      // Créer le dossier de stockage s'il n'existe pas
      const storagePath = this.getStoragePath();
      const exists = await RNFS.exists(storagePath);

      if (!exists) {
        await RNFS.mkdir(storagePath);
      }

      // Nettoyer les anciens fichiers si nécessaire
      if (this.config.autoDelete) {
        await this.cleanupOldFiles();
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation du stockage:", error);
      return false;
    }
  }

  /**
   * Obtient le chemin de stockage des vidéos
   */
  getStoragePath(): string {
    if (Platform.OS === 'ios') {
      return `${RNFS.DocumentDirectoryPath}/Videos`;
    } else {
      return `${RNFS.ExternalDirectoryPath}/DashCamAuto/Videos`;
    }
  }

  /**
   * Sauvegarde une vidéo avec ses métadonnées
   */
  async saveVideo(
    sourcePath: string,
    metadata: Omit<VideoMetadata, 'path' | 'filename'>,
  ): Promise<VideoMetadata | null> {
    try {
      const storagePath = this.getStoragePath();
      const filename = `dashcam_${metadata.timestamp}.mp4`;
      const destinationPath = `${storagePath}/${filename}`;

      // Copier le fichier vers le stockage
      await RNFS.copyFile(sourcePath, destinationPath);

      // Créer le fichier de métadonnées
      const metadataPath = `${storagePath}/${filename}.json`;
      const metadataContent = JSON.stringify(
        {
          ...metadata,
          path: destinationPath,
          filename,
        },
        null,
        2,
      );

      await RNFS.writeFile(metadataPath, metadataContent, 'utf8');

      const videoMetadata: VideoMetadata = {
        ...metadata,
        path: destinationPath,
        filename,
      };

      return videoMetadata;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la vidéo:', error);
      return null;
    }
  }

  /**
   * Obtient la liste des vidéos sauvegardées
   */
  async getSavedVideos(): Promise<VideoMetadata[]> {
    try {
      const storagePath = this.getStoragePath();
      const files = await RNFS.readDir(storagePath);

      const videoFiles = files.filter(file => file.name.endsWith('.mp4'));
      const videos: VideoMetadata[] = [];

      for (const file of videoFiles) {
        const metadataPath = `${storagePath}/${file.name}.json`;
        const metadataExists = await RNFS.exists(metadataPath);

        if (metadataExists) {
          try {
            const metadataContent = await RNFS.readFile(metadataPath, 'utf8');
            const metadata = JSON.parse(metadataContent) as VideoMetadata;
            videos.push(metadata);
          } catch (error) {
            console.error(`Erreur lors de la lecture des métadonnées pour ${file.name}:`, error);
          }
        }
      }

      // Trier par timestamp (plus récent en premier)
      return videos.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos:', error);
      return [];
    }
  }

  /**
   * Supprime une vidéo et ses métadonnées
   */
  async deleteVideo(videoPath: string): Promise<boolean> {
    try {
      // Supprimer le fichier vidéo
      const videoExists = await RNFS.exists(videoPath);
      if (videoExists) {
        await RNFS.unlink(videoPath);
      }

      // Supprimer le fichier de métadonnées
      const metadataPath = `${videoPath}.json`;
      const metadataExists = await RNFS.exists(metadataPath);
      if (metadataExists) {
        await RNFS.unlink(metadataPath);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la vidéo:', error);
      return false;
    }
  }

  /**
   * Obtient l'espace de stockage utilisé
   */
  async getStorageUsage(): Promise<{used: number; total: number; percentage: number}> {
    try {
      const storagePath = this.getStoragePath();
      const files = await RNFS.readDir(storagePath);

      let totalSize = 0;
      for (const file of files) {
        if (file.isFile()) {
          totalSize += file.size;
        }
      }

      const maxSizeBytes = this.config.maxSizeGB * 1024 * 1024 * 1024;
      const percentage = (totalSize / maxSizeBytes) * 100;

      return {
        used: totalSize,
        total: maxSizeBytes,
        percentage,
      };
    } catch (error) {
      console.error("Erreur lors du calcul de l'espace de stockage:", error);
      return {used: 0, total: 0, percentage: 0};
    }
  }

  /**
   * Nettoie les anciens fichiers pour libérer de l'espace
   */
  async cleanupOldFiles(): Promise<void> {
    try {
      const videos = await this.getSavedVideos();
      const usage = await this.getStorageUsage();

      if (usage.percentage < 90) {
        return; // Pas besoin de nettoyer
      }

      // Supprimer les vidéos les plus anciennes jusqu'à atteindre 80% d'utilisation
      const videosToDelete = videos.slice(Math.floor(videos.length * 0.2));

      for (const video of videosToDelete) {
        await this.deleteVideo(video.path);
      }

      console.log(`${videosToDelete.length} vidéos supprimées pour libérer de l'espace`);
    } catch (error) {
      console.error('Erreur lors du nettoyage des fichiers:', error);
    }
  }

  /**
   * Exporte une vidéo vers le stockage externe
   */
  async exportVideo(videoPath: string, destinationPath: string): Promise<boolean> {
    try {
      await RNFS.copyFile(videoPath, destinationPath);
      return true;
    } catch (error) {
      console.error("Erreur lors de l'export de la vidéo:", error);
      return false;
    }
  }

  /**
   * Met à jour la configuration de stockage
   */
  updateConfig(newConfig: Partial<StorageConfig>): void {
    this.config = {...this.config, ...newConfig};
  }

  /**
   * Obtient la configuration actuelle
   */
  getConfig(): StorageConfig {
    return {...this.config};
  }

  /**
   * Formate la taille de fichier pour l'affichage
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Formate la durée pour l'affichage
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    // Nettoyage si nécessaire
  }
}

export default StorageService.getInstance();
