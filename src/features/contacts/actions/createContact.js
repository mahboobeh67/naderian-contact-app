import { STORAGE_KEYS } from "../../../storage/storageKeys";
import { loadStorage, writeStorage } from "../../../storage/storageUtils";
import { ACTION_TYPES } from "../context/actionTypes";

/**
 * Sanitizes contact fields (trims strings, lowercases email).
 */
const sanitizeContact = (data) => ({
  ...data,
  name: data.name?.trim(),
  phone: data.phone?.trim(),
  email: data.email?.trim().toLowerCase(),
  createdAt: new Date().toISOString(),
});

/**
 * Creates new contact and updates storage
 * Flux‑B2 pattern | pure, storage‑synced
 */
export const createContact = (dispatch) => (newData) => {
  // 1️⃣ بارگذاری لیست فعلی از Storage
  const current = loadStorage(STORAGE_KEYS.CONTACT_LIST) || [];

  // 2️⃣ پاک‌سازی و افزودن شناسه
  const sanitized = sanitizeContact(newData);
  const contact = {
    id: Date.now().toString(), // یا uuid در آینده
    ...sanitized,
  };

  // 3️⃣ افزودن به ابتدای لیست (آخرین تماس بالا)
  const updatedList = [contact, ...current];

  // 4️⃣ ذخیره در localStorage
  writeStorage(STORAGE_KEYS.CONTACT_LIST, updatedList);

  // 5️⃣ dispatch موفقیت
  dispatch({
    type: ACTION_TYPES.CREATE_CONTACT_SUCCESS,
    payload: contact,
  });
};
