// StorageService.test.js
import StorageService from '../../utils/storage';

describe('StorageService', () => {
  beforeEach(() => {
    // Clear the storage before each test
    jest.clearAllMocks();
  });

  describe('setAppId', () => {
    test('sets the appId in localStorage', () => {
      const appId = 'test-app-id';
      StorageService.setAppId(appId);
      expect(StorageService.getAppId()).toBe(appId);
    });
  });

  describe('getAppId', () => {
    test('returns the appId from localStorage', () => {
      const appId = 'test-app-id';
      StorageService.setAppId(appId);
      expect(StorageService.getAppId()).toBe(appId);
    });
  });

  describe('removeAppKey', () => {
    test('removes the appId from localStorage', () => {
      const appId = 'test-app-id';
      StorageService.setAppId(appId);
      StorageService.removeAppKey();
      expect(StorageService.getAppId()).toBeNull();
    });
  });

  test('removes global window object and still works', () => {
    // Simulate removing the global window object
    delete global.window;
    const appId = 'test-app-id-node-global-remove';
    StorageService.setAppId(appId);

    expect(StorageService.getAppId()).toBe(appId);
    StorageService.removeAppKey();
    expect(StorageService.getAppId()).toBeNull();
  });
});
