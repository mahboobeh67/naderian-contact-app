// src/storage/storageUtils.js

export function loadStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("❌ Error reading storage:", error);
    return null;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("❌ Error writing storage:", error);
  }
}

export function clearStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("❌ Error clearing storage:", error);
  }
}
