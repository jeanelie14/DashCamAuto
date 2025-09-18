export interface CameraConfig {
  resolution: '720p' | '1080p' | '4k';
  fps: number;
  bitrate?: number;
  codec?: 'h264' | 'h265';
  audioEnabled: boolean;
  audioBitrate?: number;
  audioSampleRate?: number;
}

export interface RecordingSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  filePath: string;
  size: number;
  config: CameraConfig;
  metadata: {
    location?: {
      latitude: number;
      longitude: number;
    };
    deviceInfo: {
      model: string;
      os: string;
      version: string;
    };
  };
}

export interface CameraPermission {
  camera: boolean;
  microphone: boolean;
  storage: boolean;
}

export type CameraError =
  | 'permission_denied'
  | 'camera_unavailable'
  | 'recording_failed'
  | 'storage_full'
  | 'unknown';
