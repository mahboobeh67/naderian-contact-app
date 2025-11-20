
import { ACTION_TYPES } from "../context/actionTypes";

export const createContact = (dispatch, getState) => async (newContact) => {
  try {
  
    await new Promise((res) => setTimeout(res, 150));

  
    const id = Date.now();
    const contact = { id, ...newContact };

    dispatch({
      type: ACTION_TYPES.CREATE_CONTACT,
      payload: contact,
    });

    const { contacts } = getState();
    localStorage.setItem("contactsState", JSON.stringify(contacts));

    console.log("✅ Contact created:", contact);
  } catch (err) {
    console.error("❌ createContact failed:", err);
  }
};
