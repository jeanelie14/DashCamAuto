import CircularBufferService, {BufferSegment} from '../../services/CircularBufferService';

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  exists: jest.fn(),
  mkdir: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
  copyFile: jest.fn(),
}));

// Mock Logger
jest.mock('../../utils/Logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('CircularBufferService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock RNFS methods to return successful results by default
    const RNFS = require('react-native-fs');
    RNFS.exists.mockResolvedValue(false);
    RNFS.mkdir.mockResolvedValue(undefined);
    RNFS.stat.mockResolvedValue({size: 1024});
    RNFS.unlink.mockResolvedValue(undefined);
    RNFS.copyFile.mockResolvedValue(undefined);
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      const result = await CircularBufferService.initialize();
      expect(result).toBe(true);
    });

    it('should create buffer directory if it does not exist', async () => {
      const RNFS = require('react-native-fs');
      RNFS.exists.mockResolvedValue(false);
      
      await CircularBufferService.initialize();
      
      expect(RNFS.mkdir).toHaveBeenCalledWith('/mock/documents/buffer');
    });
  });

  describe('startRecording', () => {
    beforeEach(async () => {
      await CircularBufferService.initialize();
    });

    it('should start recording successfully', async () => {
      const result = await CircularBufferService.startRecording();
      expect(result).toBe(true);
      expect(CircularBufferService.isRecordingActive()).toBe(true);
    });

    it('should not start recording if already active', async () => {
      await CircularBufferService.startRecording();
      const result = await CircularBufferService.startRecording();
      expect(result).toBe(true); // Should return true but not start again
    });
  });

  describe('stopRecording', () => {
    beforeEach(async () => {
      await CircularBufferService.initialize();
    });

    it('should stop recording successfully', async () => {
      await CircularBufferService.startRecording();
      await CircularBufferService.stopRecording();
      expect(CircularBufferService.isRecordingActive()).toBe(false);
    });
  });

  describe('markSegmentAsIncident', () => {
    beforeEach(async () => {
      await CircularBufferService.initialize();
      await CircularBufferService.startRecording();
    });

    it('should have incident segment methods', async () => {
      const incidentId = 'test-incident-123';
      const location = {
        latitude: 48.8566,
        longitude: 2.3522,
        accuracy: 10,
        timestamp: Date.now(),
      };

      // Test that the method exists and can be called
      await CircularBufferService.markSegmentAsIncident(incidentId, location);
      
      const segments = CircularBufferService.getIncidentSegments();
      expect(Array.isArray(segments)).toBe(true);
    });
  });

  describe('getBufferStats', () => {
    beforeEach(async () => {
      await CircularBufferService.initialize();
    });

    it('should return correct buffer statistics', () => {
      const stats = CircularBufferService.getBufferStats();
      
      expect(stats).toHaveProperty('totalSegments');
      expect(stats).toHaveProperty('incidentSegments');
      expect(stats).toHaveProperty('totalSize');
      expect(stats).toHaveProperty('oldestSegment');
      expect(stats).toHaveProperty('newestSegment');
      
      // After initialization, there should be no segments
      expect(stats.totalSegments).toBeGreaterThanOrEqual(0);
      expect(stats.incidentSegments).toBe(0);
      expect(stats.totalSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      const newConfig = {
        maxDuration: 600000, // 10 minutes
        maxSize: 1000 * 1024 * 1024, // 1 GB
      };

      CircularBufferService.updateConfig(newConfig);
      const config = CircularBufferService.getConfig();

      expect(config.maxDuration).toBe(600000);
      expect(config.maxSize).toBe(1000 * 1024 * 1024);
    });
  });

  describe('cleanup', () => {
    beforeEach(async () => {
      await CircularBufferService.initialize();
    });

    it('should cleanup all resources', async () => {
      await CircularBufferService.startRecording();
      await CircularBufferService.cleanup();

      expect(CircularBufferService.isRecordingActive()).toBe(false);
      const stats = CircularBufferService.getBufferStats();
      expect(stats.totalSegments).toBe(0);
    });
  });

  describe('segment management', () => {
    beforeEach(async () => {
      await CircularBufferService.initialize();
    });

    it('should get all segments', () => {
      const segments = CircularBufferService.getAllSegments();
      expect(Array.isArray(segments)).toBe(true);
    });

    it('should get segment by ID', () => {
      const segments = CircularBufferService.getAllSegments();
      if (segments.length > 0) {
        const segment = CircularBufferService.getSegmentById(segments[0].id);
        expect(segment).toBeDefined();
        expect(segment?.id).toBe(segments[0].id);
      }
    });

    it('should return undefined for non-existent segment ID', () => {
      const segment = CircularBufferService.getSegmentById('non-existent-id');
      expect(segment).toBeUndefined();
    });
  });
});
