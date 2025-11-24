import { createContext, useContext, useReducer, useEffect } from "react";
import { ContactService } from "../utils/ContactServices";

// --- 1️⃣ State & Actions ---
const initialState = { contacts: [] };

function contactsReducer(state, action) {
  switch (action.type) {
    case "LOAD_CONTACTS":
      return { ...state, contacts: action.payload };
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.payload] };
    case "DELETE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
}

// --- 2️⃣ Context ها ---
const ContactsContext = createContext();
const ContactsDispatchContext = createContext();

// --- 3️⃣ Provider ---
export function ContactsProvider({ children }) {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  useEffect(() => {
    const stored = ContactService.getAll(); // ✅ به‌جای load()
    dispatch({ type: "LOAD_CONTACTS", payload: stored });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("CONTACT_LIST", JSON.stringify(state.contacts));
  }, [state.contacts]);

  return (
    <ContactsContext.Provider value={state}>
      <ContactsDispatchContext.Provider value={dispatch}>
        {children}
      </ContactsDispatchContext.Provider>
    </ContactsContext.Provider>
  );
}

// --- 4️⃣ Custom Hooks ---
export function useContacts() {
  return useContext(ContactsContext);
}

export function useContactsActions() {
  const dispatch = useContext(ContactsDispatchContext);

  const createContact = (data) => {
    const newOne = ContactService.create(data);
    dispatch({ type: "ADD_CONTACT", payload: newOne });
  };

  const removeContact = (id) => {
    ContactService.remove(id);
    dispatch({ type: "DELETE_CONTACT", payload: id });
  };

  return { createContact, removeContact };
}
