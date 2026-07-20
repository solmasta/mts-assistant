// Data Manager Class
(function(){
  class DataManager {
    constructor() {
      this.STORAGE_KEYS = {
        EQUIPMENT: "mts_equipment",
        PARTS: "mts_parts",
        DOCS: "mts_docs",
        SETTINGS: "mts_settings",
        CHAT_HISTORY: "mts_chat_history",
        CALCULATIONS: "mts_calculations"
      };
    }
    save(key, data) {
      try {
        var enc = btoa(JSON.stringify(data));
        localStorage.setItem(key, enc);
        return true;
      } catch (e) {
        console.error('Save error:', e);
        return false;
      }
    }
    load(key, defaultValue) {
      if (defaultValue === undefined) defaultValue = [];
      try {
        var enc = localStorage.getItem(key);
        if (!enc) return defaultValue;
        return JSON.parse(atob(enc));
      } catch (e) {
        console.error('Load error:', e);
        return defaultValue;
      }
    }
    async syncToCloud() {
      if (!navigator.onLine) return false;
      try {
        var data = {
          equipment: this.load(this.STORAGE_KEYS.EQUIPMENT),
          parts: this.load(this.STORAGE_KEYS.PARTS),
          settings: this.load(this.STORAGE_KEYS.SETTINGS),
          timestamp: Date.now()
        };
        await fetch('/api/backup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(()=>{});
        return true;
      } catch (e) {
        console.error('Cloud sync error:', e);
        return false;
      }
    }
  }
  if (typeof window !== 'undefined') {
    window.DataManager = DataManager;
    window.dataManager = window.dataManager || new DataManager();
  }
})();
