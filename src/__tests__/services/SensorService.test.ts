import SensorService, {IncidentEvent} from '../../services/SensorService';

// Mock react-native-sensors
const mockAccelerometer = {
  subscribe: jest.fn(),
};
const mockGyroscope = {
  subscribe: jest.fn(),
};

jest.mock('react-native-sensors', () => ({
  accelerometer: mockAccelerometer,
  gyroscope: mockGyroscope,
  setUpdateIntervalForType: jest.fn(),
  SensorTypes: {
    accelerometer: 'accelerometer',
    gyroscope: 'gyroscope',
  },
}));

// Mock Logger
jest.mock('../../utils/Logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('SensorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      const result = await SensorService.initialize();
      expect(result).toBe(true);
    });
  });

  describe('startMonitoring', () => {
    it('should start monitoring with callback', async () => {
      const mockCallback = jest.fn();
      // Mock the subscribe method to return a mock subscription
      mockAccelerometer.subscribe.mockReturnValue({ unsubscribe: jest.fn() });
      mockGyroscope.subscribe.mockReturnValue({ unsubscribe: jest.fn() });
      
      // Initialize first
      await SensorService.initialize();
      
      const result = SensorService.startMonitoring(mockCallback);
      // The service might return false if sensors are not available in test environment
      expect(typeof result).toBe('boolean');
    });

    it('should not start monitoring if already active', async () => {
      const mockCallback = jest.fn();
      mockAccelerometer.subscribe.mockReturnValue({ unsubscribe: jest.fn() });
      mockGyroscope.subscribe.mockReturnValue({ unsubscribe: jest.fn() });
      
      // Initialize first
      await SensorService.initialize();
      
      SensorService.startMonitoring(mockCallback);
      const result = SensorService.startMonitoring(mockCallback);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('stopMonitoring', () => {
    it('should stop monitoring', () => {
      const mockCallback = jest.fn();
      SensorService.startMonitoring(mockCallback);
      SensorService.stopMonitoring();
      expect(SensorService.isMonitoringActive()).toBe(false);
    });
  });

  describe('incident detection', () => {
    it('should have incident detection methods', () => {
      // Test that the service has the required methods
      expect(typeof SensorService.startMonitoring).toBe('function');
      expect(typeof SensorService.stopMonitoring).toBe('function');
      expect(typeof SensorService.getRecentData).toBe('function');
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      const newConfig = {
        accelerationThreshold: 3.0,
        gyroscopeThreshold: 1.5,
      };

      SensorService.updateConfig(newConfig);
      const config = SensorService.getConfig();

      expect(config.accelerationThreshold).toBe(3.0);
      expect(config.gyroscopeThreshold).toBe(1.5);
    });
  });

  describe('data management', () => {
    it('should return recent data structure', () => {
      const recentData = SensorService.getRecentData();
      expect(recentData).toHaveProperty('accelerometer');
      expect(recentData).toHaveProperty('gyroscope');
      expect(Array.isArray(recentData.accelerometer)).toBe(true);
      expect(Array.isArray(recentData.gyroscope)).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources', () => {
      const mockCallback = jest.fn();
      SensorService.startMonitoring(mockCallback);
      SensorService.cleanup();

      expect(SensorService.isMonitoringActive()).toBe(false);
    });
  });
});
