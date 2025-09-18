export const APP_CONFIG = {
  NAME: 'DashCam Auto',
  VERSION: '1.0.0',
  BUILD: '1',
} as const;

export const CAMERA_CONFIG = {
  DEFAULT_RESOLUTION: '1080p' as const,
  DEFAULT_FPS: 30,
  DEFAULT_BUFFER_SECONDS: 10,
  MAX_ZOOM: 5,
  MIN_ZOOM: 1,
  SUPPORTED_RESOLUTIONS: ['720p', '1080p', '4k'] as const,
  SUPPORTED_FPS: [24, 30, 60] as const,
} as const;

export const STORAGE_CONFIG = {
  DEFAULT_MAX_SIZE_GB: 5,
  MAX_SIZE_GB: 50,
  MIN_SIZE_GB: 1,
  COMPRESSION_LEVELS: ['low', 'medium', 'high'] as const,
  AUTO_DELETE_THRESHOLD: 0.9, // 90% full
} as const;

export const DETECTION_CONFIG = {
  DEFAULT_SENSITIVITY: 0.7,
  MIN_SENSITIVITY: 0.1,
  MAX_SENSITIVITY: 1.0,
  G_FORCE_THRESHOLD: 2.5, // g-force threshold for collision detection
  SPEED_THRESHOLD: 5, // km/h threshold for movement detection
  BUFFER_BEFORE_SECONDS: 10,
  BUFFER_AFTER_SECONDS: 20,
} as const;

export const LOCATION_CONFIG = {
  DEFAULT_UPDATE_INTERVAL: 1000, // 1 second
  MIN_UPDATE_INTERVAL: 500, // 0.5 seconds
  MAX_UPDATE_INTERVAL: 5000, // 5 seconds
  ACCURACY_THRESHOLD: 10, // meters
  HIGH_ACCURACY_THRESHOLD: 5, // meters
} as const;

export const THEME_CONFIG = {
  LIGHT: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F2F2F7',
    TEXT: '#000000',
    TEXT_SECONDARY: '#666666',
  },
  DARK: {
    PRIMARY: '#0A84FF',
    SECONDARY: '#5E5CE6',
    SUCCESS: '#30D158',
    WARNING: '#FF9F0A',
    ERROR: '#FF453A',
    BACKGROUND: '#000000',
    SURFACE: '#1C1C1E',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#8E8E93',
  },
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const FILE_PATHS = {
  RECORDINGS: 'recordings',
  THUMBNAILS: 'thumbnails',
  EXPORTS: 'exports',
  LOGS: 'logs',
} as const;

export const INCIDENT_TYPES = {
  COLLISION: 'collision',
  HARD_BRAKE: 'hard_brake',
  ACCELERATION: 'acceleration',
  FATIGUE: 'fatigue',
  MOVEMENT: 'movement',
  MANUAL: 'manual',
  SPEEDING: 'speeding',
  LANE_DEPARTURE: 'lane_departure',
  OBJECT_DETECTION: 'object_detection',
} as const;

export const INCIDENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;
