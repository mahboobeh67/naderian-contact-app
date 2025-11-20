// src/features/contacts/context/ContactsContext.jsx
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { contactsReducer } from "./contactsReducer.js";
import { contactsInitialState } from "./contactsInitialState.js";
import * as Actions from "../actions"; 

// ایجاد دو context جدا برای State و Dispatch
const ContactsStateContext = createContext(undefined);
const ContactsDispatchContext = createContext(undefined);
const actions = {
  createContact: Actions.createContact(dispatch, getState),
  updateContact: Actions.updateContact(dispatch, getState),
  deleteContact: Actions.deleteContact(dispatch, getState),
  deleteSelected: Actions.deleteSelected(dispatch, getState),
};

export const ContactsProvider = ({ children, onMounted, onSync }) => {
  const [state, dispatch] = useReducer(
    contactsReducer,
    undefined,
    contactsInitialState
  );
  const getState = () => state;

  // ساخت actions با pattern Flux‑B2 (factory binding)
  const actions = {
    createContact:
      typeof Actions.createContact === "function"
        ? Actions.createContact(dispatch, getState)
        : console.error("❌ createContact missing from Actions barrel"),
    updateContact:
      typeof Actions.updateContact === "function"
        ? Actions.updateContact(dispatch, getState)
        : console.error("❌ updateContact missing from Actions barrel"),
    deleteContact:
      typeof Actions.deleteContact === "function"
        ? Actions.deleteContact(dispatch, getState)
        : console.error("❌ deleteContact missing from Actions barrel"),
    deleteSelected:
      typeof Actions.deleteSelected === "function"
        ? Actions.deleteSelected(dispatch, getState)
        : console.error("❌ deleteSelected missing from Actions barrel"),
    ...(typeof Actions.uiActions === "function"
      ? Actions.uiActions(dispatch)
      : {}),
  };

  // lifecycle syncing
  useEffect(() => {
    if (typeof onMounted === "function") onMounted(state);
  }, []);
  useEffect(() => {
    if (typeof onSync === "function") onSync(state.contacts);
  }, [state.contacts, onSync]);

  return (
    <ContactsStateContext.Provider value={state}>
      <ContactsDispatchContext.Provider value={{ dispatch, actions }}>
        {children}
      </ContactsDispatchContext.Provider>
    </ContactsStateContext.Provider>
  );
};

// custom hooks
export const useContactsState = () => {
  const ctx = useContext(ContactsStateContext);
  if (!ctx)
    throw new Error("❌ useContactsState باید داخل ContactsProvider فراخوانی شود");
  return ctx;
};

export const useContactsDispatch = () => {
  const ctx = useContext(ContactsDispatchContext);
  if (!ctx)
    throw new Error("❌ useContactsDispatch باید داخل ContactsProvider فراخوانی شود");
  return ctx;
};

export const useContacts = () => {
  const state = useContactsState();
  const { dispatch, actions } = useContactsDispatch();
  return { state, dispatch, actions };
};

// برای تسهیل تست در موارد خاص
export { ContactsStateContext, ContactsDispatchContext };
export default ContactsProvider;
