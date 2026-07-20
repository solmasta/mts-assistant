const hasStorage = () => {
  try {
    const testKey = '__mts_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('Storage unavailable, falling back to in-memory mode.', error);
    return false;
  }
};

export class DataManager {
  constructor() {
    this.STORAGE_KEYS = {
      EQUIPMENT: 'mts_equipment',
      PARTS: 'mts_parts',
      DOCS: 'mts_docs',
      SETTINGS: 'mts_settings',
      CHAT_HISTORY: 'mts_chat_history',
      CALCULATIONS: 'mts_calculations'
    };
    this._storageAvailable = hasStorage();
  }

  _getStorage() {
    return this._storageAvailable ? window.localStorage : null;
  }

  _encode(value) {
    return typeof btoa === 'function'
      ? btoa(JSON.stringify(value))
      : Buffer.from(JSON.stringify(value), 'utf8').toString('base64');
  }

  _decode(value) {
    if (!value) return null;
    return typeof atob === 'function'
      ? JSON.parse(atob(value))
      : JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
  }

  save(key, data) {
    try {
      const storage = this._getStorage();
      if (!storage) return false;
      storage.setItem(key, this._encode(data));
      return true;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  }

  load(key, defaultValue = []) {
    try {
      const storage = this._getStorage();
      if (!storage) return defaultValue;
      const encrypted = storage.getItem(key);
      if (!encrypted) return defaultValue;
      return this._decode(encrypted);
    } catch (error) {
      console.error('Load error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      const storage = this._getStorage();
      if (!storage) return false;
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Remove error:', error);
      return false;
    }
  }

  clear() {
    Object.values(this.STORAGE_KEYS).forEach((key) => this.remove(key));
  }

  async syncToCloud() {
    if (!navigator.onLine) return false;

    try {
      const payload = {
        equipment: this.load(this.STORAGE_KEYS.EQUIPMENT),
        parts: this.load(this.STORAGE_KEYS.PARTS),
        settings: this.load(this.STORAGE_KEYS.SETTINGS),
        timestamp: Date.now()
      };

      // Replace this endpoint with your real cloud sync API when available.
      // const response = await fetch('https://your-backend-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Cloud sync error:', error);
      return false;
    }
  }
}

export default DataManager;
