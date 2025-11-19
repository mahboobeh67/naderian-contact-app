import { ACTION_TYPES } from "../actionTypes";
import { writeStorage } from "@/storage/storageUtils";
import { STORAGE_KEYS } from "@/storage/storageKeys";
import { v4 as uuid } from "uuid";

export const createContactAction = (dispatch, getState) => (data) => {
  const newContact = { ...data, id: uuid() };

  const { contacts } = getState();
  const updatedList = [...contacts, newContact];

  // Side-Effect فقط اینجاست
  writeStorage(STORAGE_KEYS.CONTACT_LIST, updatedList);

  dispatch({
    type: ACTION_TYPES.CREATE_CONTACT,
    payload: newContact,
  });
};