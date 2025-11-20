// ===============================
//  Action: updateContact (Model B2)
// ===============================
import { ACTION_TYPES } from "../context/actionTypes";

/**
 * بروزرسانی مخاطب موجود
 */
export const updateContact = (dispatch, getState) => async (updatedContact) => {
  try {
    const { contacts } = getState();
    const exists = contacts.find((c) => c.id === updatedContact.id);

    if (!exists) {
      console.warn("⚠️ contact not found:", updatedContact.id);
      return;
    }

    await new Promise((res) => setTimeout(res, 100));

    dispatch({
      type: ACTION_TYPES.UPDATE_CONTACT,
      payload: updatedContact,
    });

    localStorage.setItem(
      "contactsState",
      JSON.stringify(getState().contacts)
    );

    console.log("🔧 Contact updated:", updatedContact);
  } catch (err) {
    console.error("❌ updateContact failed:", err);
  }
};
