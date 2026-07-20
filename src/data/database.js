import Dexie from 'dexie';

const db = new Dexie('HVACAssistant');
db.version(1).stores({
  equipment: '++id, type, brand, model, serial',
  parts: '++id, partNumber, description',
  service: '++id, equipmentId, date',
  chat: '++id, timestamp',
});

export default db;
