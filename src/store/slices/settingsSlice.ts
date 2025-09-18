import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'fr' | 'es' | 'de';
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    incidentAlerts: boolean;
    lowStorage: boolean;
  };
  storage: {
    maxSizeGB: number;
    autoDelete: boolean;
    compressionLevel: 'low' | 'medium' | 'high';
  };
  privacy: {
    locationTracking: boolean;
    dataCollection: boolean;
    crashReporting: boolean;
  };
  advanced: {
    debugMode: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    performanceMonitoring: boolean;
  };
}

const initialState: SettingsState = {
  theme: 'auto',
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    incidentAlerts: true,
    lowStorage: true,
  },
  storage: {
    maxSizeGB: 5,
    autoDelete: true,
    compressionLevel: 'medium',
  },
  privacy: {
    locationTracking: true,
    dataCollection: true,
    crashReporting: true,
  },
  advanced: {
    debugMode: false,
    logLevel: 'info',
    performanceMonitoring: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'fr' | 'es' | 'de'>) => {
      state.language = action.payload;
    },
    updateNotifications: (
      state,
      action: PayloadAction<Partial<SettingsState['notifications']>>,
    ) => {
      state.notifications = {...state.notifications, ...action.payload};
    },
    updateStorage: (state, action: PayloadAction<Partial<SettingsState['storage']>>) => {
      state.storage = {...state.storage, ...action.payload};
    },
    updatePrivacy: (state, action: PayloadAction<Partial<SettingsState['privacy']>>) => {
      state.privacy = {...state.privacy, ...action.payload};
    },
    updateAdvanced: (state, action: PayloadAction<Partial<SettingsState['advanced']>>) => {
      state.advanced = {...state.advanced, ...action.payload};
    },
    resetSettings: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotifications,
  updateStorage,
  updatePrivacy,
  updateAdvanced,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
