// src/modules/contacts/context/contactContext.js
import React, { createContext, useReducer } from "react";
import { contactReducer } from "./contactReducer";
import { ACTION_TYPES } from "./actionTypes";
import { ContactService } from "../services/contactService";

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, { contacts: [] });

  const loadContacts = () => {
    const data = ContactService.getAll();
    dispatch({ type: ACTION_TYPES.LOAD_CONTACTS, payload: data });
  };

  const createContact = (formData) => {
    const newContact = ContactService.create(formData);
    dispatch({
      type: ACTION_TYPES.CREATE_CONTACT_SUCCESS,
      payload: newContact,
    });
  };

  const deleteContact = (id) => {
    ContactService.remove(id);
    dispatch({ type: ACTION_TYPES.DELETE_CONTACT, payload: id });
  };

  return (
    <ContactContext.Provider
      value={{ state, loadContacts, createContact, deleteContact }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default ContactContext;
