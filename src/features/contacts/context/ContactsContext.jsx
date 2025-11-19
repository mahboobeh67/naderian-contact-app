import React, { createContext, useReducer, useContext } from "react";
import { contactsReducer } from "./contactsReducer";
import { contactsInitialState } from "./contactsInitialState";
import * as Actions from "@/features/contacts/actions";

const ContactsStateContext = createContext(undefined);
const ContactsDispatchContext = createContext(undefined);

export const ContactsProvider = ({ children, onSync, onMounted }) => {
  const [state, dispatch] = useReducer(
    contactsReducer,
    undefined,
    contactsInitialState
  );
  const getState = () => state;

  const actions = {
    createContact: Actions.createContact(dispatch, getState),
    // بقیه اکشن‌ها بعداً اضافه می‌شن
  };

  React.useEffect(() => {
    onMounted?.(state);
  }, []);

  React.useEffect(() => {
    onSync?.(state.contacts);
  }, [state.contacts]);

  return (
    <ContactsStateContext.Provider value={state}>
      <ContactsDispatchContext.Provider value={{ dispatch, actions }}>
        {children}
      </ContactsDispatchContext.Provider>
    </ContactsStateContext.Provider>
  );
};

export const useContactsState = () => useContext(ContactsStateContext);
export const useContactsDispatch = () => useContext(ContactsDispatchContext);

export const useContacts = () => {
  const state = useContactsState();
  const { dispatch, actions } = useContactsDispatch();
  return { state, dispatch, actions };
};
