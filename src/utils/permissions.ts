import {Platform, Alert, Linking} from 'react-native';
import {request, PERMISSIONS, RESULTS, Permission} from 'react-native-permissions';

export interface PermissionStatus {
  camera: boolean;
  microphone: boolean;
  location: boolean;
  storage: boolean;
}

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const permission: Permission = Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    }) as Permission;

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const permission: Permission = Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    }) as Permission;

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    return false;
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const permission: Permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }) as Permission;

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const requestStoragePermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }
    // iOS doesn't require explicit storage permission
    return true;
  } catch (error) {
    console.error('Error requesting storage permission:', error);
    return false;
  }
};

export const requestAllPermissions = async (): Promise<PermissionStatus> => {
  const [camera, microphone, location, storage] = await Promise.all([
    requestCameraPermission(),
    requestMicrophonePermission(),
    requestLocationPermission(),
    requestStoragePermission(),
  ]);

  return {
    camera,
    microphone,
    location,
    storage,
  };
};

export const showPermissionAlert = (permission: string) => {
  Alert.alert(
    'Permission Required',
    `${permission} permission is required for this app to function properly. Please enable it in settings.`,
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ],
  );
};

export const checkAllPermissions = async (): Promise<PermissionStatus> => {
  try {
    const permissions = await requestAllPermissions();

    // Show alerts for denied permissions
    if (!permissions.camera) {
      showPermissionAlert('Camera');
    }
    if (!permissions.microphone) {
      showPermissionAlert('Microphone');
    }
    if (!permissions.location) {
      showPermissionAlert('Location');
    }
    if (!permissions.storage) {
      showPermissionAlert('Storage');
    }

    return permissions;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      camera: false,
      microphone: false,
      location: false,
      storage: false,
    };
  }
};
