export function saveOfflineDocument(key, value) {
  try {
    localStorage.setItem(`docs:${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Unable to save offline document:', error);
    return false;
  }
}

export function loadOfflineDocument(key) {
  try {
    const raw = localStorage.getItem(`docs:${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Unable to load offline document:', error);
    return null;
  }
}

export function clearOfflineDocument(key) {
  try {
    localStorage.removeItem(`docs:${key}`);
    return true;
  } catch (error) {
    console.warn('Unable to clear offline document:', error);
    return false;
  }
}
