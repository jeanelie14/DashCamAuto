import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Incident {
  id: string;
  timestamp: number;
  type: 'collision' | 'hard_brake' | 'acceleration' | 'fatigue' | 'movement' | 'manual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  videoPath: string;
  thumbnailPath?: string;
  metadata: {
    speed?: number;
    direction?: number;
    gForce?: number;
    confidence?: number;
  };
  isUploaded: boolean;
  isProtected: boolean;
}

export interface IncidentState {
  incidents: Incident[];
  isDetecting: boolean;
  lastIncident: Incident | null;
  detectionSensitivity: number;
  autoUpload: boolean;
  error: string | null;
}

const initialState: IncidentState = {
  incidents: [],
  isDetecting: false,
  lastIncident: null,
  detectionSensitivity: 0.7,
  autoUpload: true,
  error: null,
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
} = incidentSlice.actions;

export default incidentSlice.reducer;
