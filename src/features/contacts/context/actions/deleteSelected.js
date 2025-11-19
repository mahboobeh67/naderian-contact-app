import { ACTION_TYPES } from "../actionTypes";
import { writeStorage } from "@/storage/storageUtils";
import { STORAGE_KEYS } from "@/storage/storageKeys";

export const deleteSelected = (dispatch, getState) => (ids) => {
  const { contacts } = getState();

  const updated = contacts.filter(({ id }) => !ids.includes(id));

  writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);

  dispatch({
    type: ACTION_TYPES.DELETE_SELECTED_SUCCESS,
    payload: ids,
  });
};