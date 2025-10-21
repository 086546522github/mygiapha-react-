// Simple data sync utilities (localStorage-based)
// Provides minimal implementations for the app to run.

export function getUserKey(user, suffix = '') {
  const uid = typeof user === 'string' ? user : (user && user.id) || 'anon';
  return `giapha_${uid}${suffix ? `_${suffix}` : ''}`;
}

export function loadDataInFormat(user, key) {
  try {
    const k = getUserKey(user, key);
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadDataInFormat error', e);
    return null;
  }
}

export function saveDataInBothFormats(data, user, key = 'memberlist') {
  try {
    const k = getUserKey(user, key);
    const json = JSON.stringify(data);
    localStorage.setItem(k, json);
    // also save a plaintext backup key
    localStorage.setItem(`${k}_backup`, json);
    return true;
  } catch (e) {
    console.error('saveDataInBothFormats error', e);
    return false;
  }
}

export default {
  getUserKey,
  loadDataInFormat,
  saveDataInBothFormats,
};
