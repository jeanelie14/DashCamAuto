import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface CameraState {
  isRecording: boolean;
  isFrontCamera: boolean;
  flashEnabled: boolean;
  flashMode: 'on' | 'off' | 'auto';
  zoomLevel: number;
  focusMode: 'auto' | 'manual';
  resolution: '720p' | '1080p' | '4k';
  fps: number;
  bufferSeconds: number;
  lastRecordingPath: string | null;
  currentRecordingPath: string | null;
  error: string | null;
  isInitialized: boolean;
  hasPermission: boolean;
}

const initialState: CameraState = {
  isRecording: false,
  isFrontCamera: false,
  flashEnabled: false,
  flashMode: 'off',
  zoomLevel: 1,
  focusMode: 'auto',
  resolution: '1080p',
  fps: 30,
  bufferSeconds: 10,
  lastRecordingPath: null,
  currentRecordingPath: null,
  error: null,
  isInitialized: false,
  hasPermission: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
    toggleCamera: state => {
      state.isFrontCamera = !state.isFrontCamera;
    },
    setFlash: (state, action: PayloadAction<boolean>) => {
      state.flashEnabled = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoomLevel = Math.max(1, Math.min(5, action.payload));
    },
    setFocusMode: (state, action: PayloadAction<'auto' | 'manual'>) => {
      state.focusMode = action.payload;
    },
    setResolution: (state, action: PayloadAction<'720p' | '1080p' | '4k'>) => {
      state.resolution = action.payload;
    },
    setFps: (state, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },
    setBufferSeconds: (state, action: PayloadAction<number>) => {
      state.bufferSeconds = action.payload;
    },
    setLastRecordingPath: (state, action: PayloadAction<string | null>) => {
      state.lastRecordingPath = action.payload;
    },
    setCurrentRecordingPath: (state, action: PayloadAction<string | null>) => {
      state.currentRecordingPath = action.payload;
    },
    setFlashMode: (state, action: PayloadAction<'on' | 'off' | 'auto'>) => {
      state.flashMode = action.payload;
      state.flashEnabled = action.payload !== 'off';
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setPermission: (state, action: PayloadAction<boolean>) => {
      state.hasPermission = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetCamera: () => initialState,
  },
});

export const {
  setRecording,
  toggleCamera,
  setFlash,
  setFlashMode,
  setZoom,
  setFocusMode,
  setResolution,
  setFps,
  setBufferSeconds,
  setLastRecordingPath,
  setCurrentRecordingPath,
  setInitialized,
  setPermission,
  setError,
  resetCamera,
} = cameraSlice.actions;

export default cameraSlice.reducer;
