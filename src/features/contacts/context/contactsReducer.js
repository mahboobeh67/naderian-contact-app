import { ACTION_TYPES } from "./actionTypes";
import { contactsInitialState } from "./contactsInitialState";

export const contactsReducer = (state, action) => {
  switch (action.type) {
    // ============================
    // ✅ UI → تغییر فیلد فرم
    // ============================
    case ACTION_TYPES.UPDATE_CURRENT_CONTACT:
      return {
        ...state,
        currentContact: {
          ...state.currentContact,
          [action.payload.field]: action.payload.value,
        },
      };

    // ============================
    // ✅ UI → ارورها
    // ============================
    case ACTION_TYPES.SET_ERRORS:
      return {
        ...state,
        errors: { ...action.payload },
      };

    case ACTION_TYPES.CLEAR_ERRORS:
      return {
        ...state,
        errors: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
      };

    // ============================
    // ✅ UI → سرچ
    // ============================
    case ACTION_TYPES.SET_SEARCH:
      return {
        ...state,
        search: action.payload,
      };

    // ============================
    // ✅ UI → مودال
    // ============================
    case ACTION_TYPES.TOGGLE_MODAL:
      return {
        ...state,
        modal: {
          ...state.modal,
          ...action.payload,
        },
      };

    // ============================
    // ✅ UI → انتخاب چندتایی
    // ============================
    case ACTION_TYPES.SET_SELECTED_IDS:
      return {
        ...state,
        selectedIds: [...action.payload],
      };

    // ============================
    // 🚀 CRUD — نتیجه اکشن‌های Async (خالص)
    // ============================

    // 🟩 ایجاد مخاطب
    case ACTION_TYPES.CREATE_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        currentContact: {
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
        errors: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
      };

    // 🟦 ویرایش مخاطب
    case ACTION_TYPES.UPDATE_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id ? { ...action.payload } : c
        ),
        editingId: null,
      };

    // 🟥 حذف تک مخاطب
    case ACTION_TYPES.DELETE_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload),
      };

    // 🟧 حذف چندتایی
    case ACTION_TYPES.DELETE_SELECTED_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.filter(
          ({ id }) => !action.payload.includes(id)
        ),
        selectedIds: [],
      };

    // ============================
    // 🟪 تغییر آیتم در حال ویرایش
    // ============================
    case ACTION_TYPES.SET_EDITING_ID:
      return {
        ...state,
        editingId: action.payload,
      };

    // ============================
    // ⚡ ریست همه State
    // ============================
    case ACTION_TYPES.RESET_STATE:
      return contactsInitialState();

    // ============================
    // 🟦 Default
    // ============================
    default:
      return state;
  }
};
