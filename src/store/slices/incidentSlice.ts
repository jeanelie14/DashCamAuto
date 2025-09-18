import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IncidentData, IncidentType, IncidentSeverity, SensorData} from '../../types/incident';

export interface Incident extends IncidentData {
  // Additional fields for Redux state management
  isProcessing?: boolean;
  processingProgress?: number;
}

export interface IncidentState {
  incidents: Incident[];
  isDetecting: boolean;
  lastIncident: Incident | null;
  detectionSensitivity: number;
  autoUpload: boolean;
  error: string | null;
  sensorConfig: {
    accelerationThreshold: number;
    gyroscopeThreshold: number;
    timeWindow: number;
    minIncidentDuration: number;
  };
  recentSensorData: {
    accelerometer: SensorData[];
    gyroscope: SensorData[];
  };
}

const initialState: IncidentState = {
  incidents: [],
  isDetecting: false,
  lastIncident: null,
  detectionSensitivity: 0.7,
  autoUpload: true,
  error: null,
  sensorConfig: {
    accelerationThreshold: 2.5,
    gyroscopeThreshold: 1.0,
    timeWindow: 2000,
    minIncidentDuration: 100,
  },
  recentSensorData: {
    accelerometer: [],
    gyroscope: [],
  },
};

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.incidents.unshift(action.payload);
      state.lastIncident = action.payload;
    },
    updateIncident: (state, action: PayloadAction<{id: string; updates: Partial<Incident>}>) => {
      const index = state.incidents.findIndex(incident => incident.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index] = {...state.incidents[index], ...action.payload.updates};
      }
    },
    deleteIncident: (state, action: PayloadAction<string>) => {
      state.incidents = state.incidents.filter(incident => incident.id !== action.payload);
    },
    setDetecting: (state, action: PayloadAction<boolean>) => {
      state.isDetecting = action.payload;
    },
    setDetectionSensitivity: (state, action: PayloadAction<number>) => {
      state.detectionSensitivity = Math.max(0, Math.min(1, action.payload));
    },
    setAutoUpload: (state, action: PayloadAction<boolean>) => {
      state.autoUpload = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearIncidents: state => {
      state.incidents = [];
      state.lastIncident = null;
    },
    addSensorIncident: (state, action: PayloadAction<{
      type: IncidentType;
      severity: IncidentSeverity;
      sensorData: {
        accelerometer: SensorData;
        gyroscope: SensorData;
      };
      location?: {
        latitude: number;
        longitude: number;
      };
    }>) => {
      const {type, severity, sensorData, location} = action.payload;
      const incident: Incident = {
        id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        type,
        severity,
        location: location || {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
        },
        video: {
          path: '',
          duration: 0,
          size: 0,
        },
        metadata: {
          sensorData,
        },
        isUploaded: false,
        isProtected: false,
        isProcessing: true,
        processingProgress: 0,
      };
      
      state.incidents.unshift(incident);
      state.lastIncident = incident;
    },
    updateSensorConfig: (state, action: PayloadAction<Partial<typeof state.sensorConfig>>) => {
      state.sensorConfig = {...state.sensorConfig, ...action.payload};
    },
    updateSensorData: (state, action: PayloadAction<{
      accelerometer?: SensorData[];
      gyroscope?: SensorData[];
    }>) => {
      if (action.payload.accelerometer) {
        state.recentSensorData.accelerometer = action.payload.accelerometer;
      }
      if (action.payload.gyroscope) {
        state.recentSensorData.gyroscope = action.payload.gyroscope;
      }
    },
    setIncidentProcessing: (state, action: PayloadAction<{
      incidentId: string;
      isProcessing: boolean;
      progress?: number;
    }>) => {
      const incident = state.incidents.find(i => i.id === action.payload.incidentId);
      if (incident) {
        incident.isProcessing = action.payload.isProcessing;
        if (action.payload.progress !== undefined) {
          incident.processingProgress = action.payload.progress;
        }
      }
    },
  },
});

export const {
  addIncident,
  updateIncident,
  deleteIncident,
  setDetecting,
  setDetectionSensitivity,
  setAutoUpload,
  setError,
  clearIncidents,
  addSensorIncident,
  updateSensorConfig,
  updateSensorData,
  setIncidentProcessing,
} = incidentSlice.actions;

export default incidentSlice.reducer;
