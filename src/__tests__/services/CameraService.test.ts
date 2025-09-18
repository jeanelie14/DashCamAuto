import CameraService from '../../services/CameraService';

// Mock des dépendances
jest.mock('react-native-vision-camera', () => ({
  Camera: {
    getCameraPermissionStatus: jest.fn(() => Promise.resolve('authorized')),
    requestCameraPermission: jest.fn(() => Promise.resolve('authorized')),
  },
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
  copyFile: jest.fn(() => Promise.resolve()),
  stat: jest.fn(() => Promise.resolve({size: 1024})),
}));

jest.mock('../../services/LocationService', () => ({
  getCurrentPosition: jest.fn(() =>
    Promise.resolve({
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 10,
      timestamp: Date.now(),
    }),
  ),
}));

jest.mock('../../services/StorageService', () => ({
  initialize: jest.fn(() => Promise.resolve(true)),
}));

describe('CameraService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize successfully', async () => {
    const result = await CameraService.initialize();
    expect(result).toBe(true);
  });

  it('should get available cameras', () => {
    const cameras = CameraService.getAvailableCameras();
    expect(cameras).toHaveProperty('back');
    expect(cameras).toHaveProperty('front');
  });

  it('should handle recording state', () => {
    const isRecording = CameraService.getRecordingState();
    expect(typeof isRecording).toBe('boolean');
  });

  it('should handle current recording path', () => {
    const path = CameraService.getCurrentRecordingPath();
    expect(path).toBeNull();
  });

  it('should cleanup resources', () => {
    expect(() => CameraService.cleanup()).not.toThrow();
  });
});
