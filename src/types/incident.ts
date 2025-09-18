export interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface IncidentMetadata {
  speed?: number;
  direction?: number;
  gForce?: number;
  confidence?: number;
  weather?: string;
  roadType?: string;
  timeOfDay?: 'day' | 'night' | 'dawn' | 'dusk';
  sensorData?: {
    accelerometer: SensorData;
    gyroscope: SensorData;
  };
}

export interface IncidentLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface IncidentVideo {
  path: string;
  duration: number;
  size: number;
  thumbnailPath?: string;
  previewFrames?: string[];
}

export interface IncidentData {
  id: string;
  timestamp: number;
  type: IncidentType;
  severity: IncidentSeverity;
  location: IncidentLocation;
  video: IncidentVideo;
  metadata: IncidentMetadata;
  isUploaded: boolean;
  isProtected: boolean;
  tags?: string[];
  notes?: string;
}

export type IncidentType =
  | 'collision'
  | 'hard_brake'
  | 'sharp_turn'
  | 'acceleration'
  | 'fatigue'
  | 'movement'
  | 'manual'
  | 'speeding'
  | 'lane_departure'
  | 'object_detection';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IncidentFilter {
  type?: IncidentType[];
  severity?: IncidentSeverity[];
  dateRange?: {
    start: number;
    end: number;
  };
  location?: {
    radius: number;
    center: {
      latitude: number;
      longitude: number;
    };
  };
  uploaded?: boolean;
  protected?: boolean;
}
