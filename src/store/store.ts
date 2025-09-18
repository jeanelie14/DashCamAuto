import {configureStore} from '@reduxjs/toolkit';
import cameraSlice from './slices/cameraSlice';
import incidentSlice from './slices/incidentSlice';
import locationSlice from './slices/locationSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    camera: cameraSlice,
    incident: incidentSlice,
    location: locationSlice,
    settings: settingsSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
