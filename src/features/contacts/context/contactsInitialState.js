// import { STORAGE_KEYS } from "../../storage/storageKeys";
// import { loadStorage } from "../../storage/storageUtils"; // این تابع هم باید باشه
import { STORAGE_KEYS } from "@/storage/storageKeys";
import { loadStorage } from "@/storage/storageUtils";

export const contactsInitialState = () => ({
  contacts: loadStorage(STORAGE_KEYS.CONTACT_LIST) || [], // دیتای اولیه از localStorage
  currentContact: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  editingId: null,
  selectedIds: [],
  search: "",
  modal: {
    isOpen: false,
    type: null, // 'add' | 'edit' | 'delete'
    data: null,
  },
  errors: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
});
