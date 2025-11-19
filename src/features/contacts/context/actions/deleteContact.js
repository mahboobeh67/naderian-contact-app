import { ACTION_TYPES } from "../actionTypes";
import { writeStorage } from "@/storage/storageUtils";
import { STORAGE_KEYS } from "@/storage/storageKeys";

export const deleteContact = (dispatch, getState) => (id) => {
  const { contacts } = getState();

  const updated = contacts.filter((c) => c.id !== id);

  writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);

  dispatch({
    type: ACTION_TYPES.DELETE_CONTACT_SUCCESS,
    payload: id,
  });
};