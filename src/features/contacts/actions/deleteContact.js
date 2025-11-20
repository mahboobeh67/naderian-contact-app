import { STORAGE_KEYS } from "../../../storage/storageKeys";
import { loadStorage, writeStorage } from "../../../storage/storageUtils";
import { ACTION_TYPES } from "../context/actionTypes";

export const deleteContact = (dispatch) => (id) => {
  const current = loadStorage(STORAGE_KEYS.CONTACT_LIST) || [];
  const updated = current.filter((c) => c.id !== id);

  writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);

  dispatch({
    type: ACTION_TYPES.DELETE_CONTACT_SUCCESS,
    payload: id,
  });
};

