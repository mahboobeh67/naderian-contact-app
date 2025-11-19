import { ACTION_TYPES } from "../actionTypes";
import { writeStorage } from "@/storage/storageUtils";
import { STORAGE_KEYS } from "@/storage/storageKeys";

export const updateContact = (dispatch, getState) => (contact) => {
  const { contacts } = getState();

  const updated = contacts.map((c) =>
    c.id === contact.id ? { ...contact } : c
  );

  writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);

  dispatch({
    type: ACTION_TYPES.UPDATE_CONTACT_SUCCESS,
    payload: contact,
  });
};