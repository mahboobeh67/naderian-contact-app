// ===============================
//  Action: deleteContact (Model B2)
// ===============================
import { ACTION_TYPES } from "../context/actionTypes";

/**
 * حذف یک مخاطب با id مشخص
 */
export const deleteContact = (dispatch, getState) => async (contactId) => {
  try {
    const { contacts } = getState();
    const exists = contacts.find((c) => c.id === contactId);
    if (!exists) {
      console.warn("⚠️ contact not found:", contactId);
      return;
    }

    await new Promise((res) => setTimeout(res, 80));

    dispatch({
      type: ACTION_TYPES.DELETE_CONTACT,
      payload: contactId,
    });

    localStorage.setItem(
      "contactsState",
      JSON.stringify(getState().contacts)
    );

    console.log("🗑️ Contact deleted:", contactId);
  } catch (err) {
    console.error("❌ deleteContact failed:", err);
  }
};
