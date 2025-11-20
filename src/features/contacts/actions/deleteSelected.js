import { STORAGE_KEYS } from "../../../storage/storageKeys";
import { loadStorage, writeStorage } from "../../../storage/storageUtils";
import { ACTION_TYPES } from "../context/actionTypes"; // ✅ مسیر درست

export const deleteSelected = (dispatch) => (selectedIds = []) => {
  const current = loadStorage(STORAGE_KEYS.CONTACT_LIST) || [];
  const updated = current.filter((c) => !selectedIds.includes(c.id));

  writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);

  dispatch({
    type: ACTION_TYPES.DELETE_SELECTED_SUCCESS,
    payload: selectedIds,
  });
};
