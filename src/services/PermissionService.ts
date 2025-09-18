import {Platform, Alert, Linking} from 'react-native';
import {request, PERMISSIONS, RESULTS, Permission} from 'react-native-permissions';

export interface PermissionStatus {
  camera: boolean;
  microphone: boolean;
  location: boolean;
  storage: boolean;
}

class PermissionService {
  private static instance: PermissionService;

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * Demande toutes les permissions nécessaires pour l'application
   */
  async requestAllPermissions(): Promise<PermissionStatus> {
    const permissions = await Promise.all([
      this.requestCameraPermission(),
      this.requestMicrophonePermission(),
      this.requestLocationPermission(),
      this.requestStoragePermission(),
    ]);

    return {
      camera: permissions[0],
      microphone: permissions[1],
      location: permissions[2],
      storage: permissions[3],
    };
  }

  /**
   * Demande la permission caméra
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      const permission: Permission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }) as Permission;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Erreur lors de la demande de permission caméra:', error);
      return false;
    }
  }

  /**
   * Demande la permission microphone
   */
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const permission: Permission = Platform.select({
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        ios: PERMISSIONS.IOS.MICROPHONE,
      }) as Permission;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Erreur lors de la demande de permission microphone:', error);
      return false;
    }
  }

  /**
   * Demande la permission de localisation
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      const permission: Permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }) as Permission;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Erreur lors de la demande de permission localisation:', error);
      return false;
    }
  }

  /**
   * Demande la permission de stockage
   */
  async requestStoragePermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS n'a pas besoin de permission de stockage explicite
        return true;
      }

      const permission: Permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Erreur lors de la demande de permission stockage:', error);
      return false;
    }
  }

  /**
   * Vérifie si toutes les permissions sont accordées
   */
  async checkAllPermissions(): Promise<PermissionStatus> {
    // Cette méthode vérifierait l'état actuel des permissions
    // Pour l'instant, on retourne false pour forcer la demande
    return {
      camera: false,
      microphone: false,
      location: false,
      storage: false,
    };
  }

  /**
   * Affiche une alerte pour rediriger vers les paramètres
   */
  showPermissionAlert(permissionType: string): void {
    Alert.alert(
      'Permission requise',
      `L'application a besoin de la permission ${permissionType} pour fonctionner correctement. Veuillez l'activer dans les paramètres.`,
      [
        {text: 'Annuler', style: 'cancel'},
        {text: 'Ouvrir les paramètres', onPress: () => Linking.openSettings()},
      ],
    );
  }

  /**
   * Vérifie si l'application peut utiliser la caméra
   */
  async canUseCamera(): Promise<boolean> {
    const cameraPermission = await this.requestCameraPermission();
    const microphonePermission = await this.requestMicrophonePermission();

    if (!cameraPermission) {
      this.showPermissionAlert('caméra');
      return false;
    }

    if (!microphonePermission) {
      this.showPermissionAlert('microphone');
      return false;
    }

    return true;
  }
}

export default PermissionService.getInstance();
