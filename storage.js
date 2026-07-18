(function (root) {
  class DataManager {
    constructor() {
      this.STORAGE_KEYS = {
        EQUIPMENT: 'mts_equipment',
        PARTS: 'mts_parts',
        DOCS: 'mts_docs',
        SETTINGS: 'mts_settings',
        CHAT_HISTORY: 'mts_chat_history',
        CALCULATIONS: 'mts_calculations'
      };
    }

    save(key, data) {
      try {
        const encrypted = btoa(JSON.stringify(data));
        localStorage.setItem(key, encrypted);
        return true;
      } catch (error) {
        console.error('Save error:', error);
        return false;
      }
    }

    load(key, defaultValue = []) {
      try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return defaultValue;
        return JSON.parse(atob(encrypted));
      } catch (error) {
        console.error('Load error:', error);
        return defaultValue;
      }
    }

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Remove error:', error);
        return false;
      }
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

        // Add your backend endpoint here when ready.
        // await fetch('https://your-backend-endpoint', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });

        return true;
      } catch (error) {
        console.error('Cloud sync error:', error);
        return false;
      }
    }
  }

  root.DataManager = DataManager;
})(window);
