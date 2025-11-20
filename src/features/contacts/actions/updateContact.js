import { STORAGE_KEYS } from "../../../storage/storageKeys";
import { loadStorage, writeStorage } from "../../../storage/storageUtils";
import { ACTION_TYPES } from "../context/actionTypes";

/**
 * Update an existing contact in storage and dispatch success.
 * Flux-B2 Model | pure + storage-synced
 */
export const updateContact = (dispatch) => (updatedData) => {
  // 1️⃣ بارگذاری لیست فعلی از localStorage
  const current = loadStorage(STORAGE_KEYS.CONTACT_LIST) || [];

  // 2️⃣ پیدا کردن ایندکس یا کانتکت موردنظر
  const index = current.findIndex((c) => c.id === updatedData.id);
  if (index === -1) {
    console.warn(
      `[Flux‑B2] updateContact → Contact with id=${updatedData.id} not found.`
    );
    return;
  }

  // 3️⃣ ساخت آبجکت جدید بدون تغییر مستقیم state فعلی
  const updatedContact = {
    ...current[index],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  // 4️⃣ ساخت لیست جدید کاملاً immutable
  const newList = [
    ...current.slice(0, index),
    updatedContact,
    ...current.slice(index + 1),
  ];

  // 5️⃣ ذخیره در localStorage با کلید تماس
  writeStorage(STORAGE_KEYS.CONTACT_LIST, newList);

  // 6️⃣ Dispatch موفق با payload جدید
  dispatch({
    type: ACTION_TYPES.UPDATE_CONTACT_SUCCESS,
    payload: updatedContact,
  });
};
