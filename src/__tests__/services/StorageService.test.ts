import StorageService from '../../services/StorageService';

// Mock des dépendances
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/test/documents',
  ExternalDirectoryPath: '/test/external',
  exists: jest.fn(() => Promise.resolve(true)),
  mkdir: jest.fn(() => Promise.resolve()),
  copyFile: jest.fn(() => Promise.resolve()),
  writeFile: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() =>
    Promise.resolve([
      {name: 'video1.mp4', isFile: () => true, size: 1024},
      {name: 'video2.mp4', isFile: () => true, size: 2048},
    ]),
  ),
  readFile: jest.fn(() =>
    Promise.resolve(
      JSON.stringify({
        path: '/test/video1.mp4',
        filename: 'video1.mp4',
        size: 1024,
        duration: 30,
        timestamp: Date.now(),
        resolution: '1080p',
        fps: 30,
        codec: 'h264',
      }),
    ),
  ),
  unlink: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize successfully', async () => {
    const result = await StorageService.initialize();
    expect(result).toBe(true);
  });

  it('should get storage path for iOS', () => {
    const path = StorageService.getStoragePath();
    expect(path).toContain('/test/documents/Videos');
  });

  it('should save video with metadata', async () => {
    const metadata = {
      size: 1024,
      duration: 30,
      timestamp: Date.now(),
      resolution: '1080p',
      fps: 30,
      codec: 'h264',
    };

    const result = await StorageService.saveVideo('/source/path', metadata);
    expect(result).toHaveProperty('path');
    expect(result).toHaveProperty('filename');
    expect(result).toHaveProperty('size');
  });

  it('should get saved videos', async () => {
    const videos = await StorageService.getSavedVideos();
    expect(Array.isArray(videos)).toBe(true);
  });

  it('should delete video', async () => {
    const result = await StorageService.deleteVideo('/test/video.mp4');
    expect(result).toBe(true);
  });

  it('should get storage usage', async () => {
    const usage = await StorageService.getStorageUsage();
    expect(usage).toHaveProperty('used');
    expect(usage).toHaveProperty('total');
    expect(usage).toHaveProperty('percentage');
  });

  it('should format file size', () => {
    const formatted = StorageService.formatFileSize(1024);
    expect(formatted).toContain('KB');
  });

  it('should format duration', () => {
    const formatted = StorageService.formatDuration(3661);
    expect(formatted).toContain(':');
  });

  it('should cleanup resources', () => {
    expect(() => StorageService.cleanup()).not.toThrow();
  });
});
