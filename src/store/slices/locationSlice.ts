import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  speed?: number;
  direction?: number;
  timestamp: number;
  address?: string;
}

export interface LocationState {
  currentLocation: LocationData | null;
  isTracking: boolean;
  hasPermission: boolean;
  accuracy: 'low' | 'medium' | 'high';
  updateInterval: number;
  error: string | null;
  speed: number; // en km/h
  isGpsActive: boolean;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  hasPermission: false,
  accuracy: 'high',
  updateInterval: 1000, // 1 second
  error: null,
  speed: 0,
  isGpsActive: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<LocationData>) => {
      state.currentLocation = action.payload;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    setPermission: (state, action: PayloadAction<boolean>) => {
      state.hasPermission = action.payload;
    },
    setAccuracy: (state, action: PayloadAction<'low' | 'medium' | 'high'>) => {
      state.accuracy = action.payload;
    },
    setUpdateInterval: (state, action: PayloadAction<number>) => {
      state.updateInterval = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateLocation: (state, action: PayloadAction<{latitude: number; longitude: number; accuracy: number; timestamp: number}>) => {
      state.currentLocation = {
        ...state.currentLocation,
        ...action.payload,
      } as LocationData;
    },
    updateSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setGpsActive: (state, action: PayloadAction<boolean>) => {
      state.isGpsActive = action.payload;
    },
    resetLocation: () => initialState,
  },
});

export const {
  setCurrentLocation,
  setTracking,
  setPermission,
  setAccuracy,
  setUpdateInterval,
  setError,
  updateLocation,
  updateSpeed,
  setGpsActive,
  resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
