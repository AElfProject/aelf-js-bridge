/**
 * @file local storage
 * @author atom-yang
 */
const storage = {};
const getWindow = () => {
  if (typeof window !== 'undefined') return window;
  return {
    localStorage: {
      setItem: (key, val) => {
        storage[key] = val;
      },
      getItem: key => storage[key] || null,
      removeItem: key => delete storage[key]
    }
  };
};

export default class StorageService {
  static setAppId(appId) {
    getWindow().localStorage.setItem('appId', appId);
  }

  static getAppId() {
    return getWindow().localStorage.getItem('appId');
  }

  static removeAppKey() {
    return getWindow().localStorage.removeItem('appId');
  }
}

const globalWindow = getWindow();

export { globalWindow as window };
