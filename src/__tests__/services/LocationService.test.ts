import LocationService from '../../services/LocationService';

// Mock des dépendances
jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn((success, _error, _options) => {
    success({
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
        accuracy: 10,
        altitude: 100,
        speed: 5.5,
        heading: 90,
      },
      timestamp: Date.now(),
    });
  }),
  watchPosition: jest.fn(() => 123),
  clearWatch: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
  PermissionsAndroid: {
    request: jest.fn(() => Promise.resolve('granted')),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
    },
  },
}));

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request location permission', async () => {
    const result = await LocationService.requestLocationPermission();
    expect(result).toBe(true);
  });

  it('should get current position', async () => {
    const location = await LocationService.getCurrentPosition();
    expect(location).toHaveProperty('latitude');
    expect(location).toHaveProperty('longitude');
    expect(location).toHaveProperty('accuracy');
    expect(location).toHaveProperty('timestamp');
  });

  it('should start location tracking', async () => {
    const mockCallback = jest.fn();
    const result = await LocationService.startLocationTracking(mockCallback);
    expect(result).toBe(true);
  });

  it('should stop location tracking', () => {
    expect(() => LocationService.stopLocationTracking()).not.toThrow();
  });

  it('should calculate distance between two points', () => {
    const distance = LocationService.calculateDistance(0, 0, 1, 1);
    expect(typeof distance).toBe('number');
    expect(distance).toBeGreaterThan(0);
  });

  it('should format location for display', () => {
    const location = {
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 10,
      timestamp: Date.now(),
    };
    const formatted = LocationService.formatLocation(location);
    expect(formatted).toContain('48.856600');
    expect(formatted).toContain('2.352200');
  });

  it('should format speed for display', () => {
    const location = {
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 10,
      speed: 5.5,
      timestamp: Date.now(),
    };
    const formatted = LocationService.formatSpeed(location);
    expect(formatted).toContain('km/h');
  });

  it('should cleanup resources', () => {
    expect(() => LocationService.cleanup()).not.toThrow();
  });
});
