// src/modules/contacts/services/contactService.js
import { STORAGE_KEYS } from "../../../storage/storageKeys";
import { loadStorage, writeStorage } from "../../../storage/storageUtils";

/**
 * Utility to sanitize and normalize contact data.
 */
const sanitizeContact = (data) => ({
  ...data,
  name: data.name?.trim(),
  phone: data.phone?.trim(),
  email: data.email?.trim().toLowerCase(),
});

/**
 * ContactService — زیرساخت منطقی بی‌طرف از UI
 * pure functions → localStorage sync + pure data return
 */
const ContactService = {
  getAll: () => loadStorage(STORAGE_KEYS.CONTACT_LIST) || [],

  create: (newData) => {
    const all = ContactService.getAll();
    const contact = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      ...sanitizeContact(newData),
      createdAt: new Date().toISOString(),
    };

    const updated = [contact, ...all];
    writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);
    return contact;
  },
  

  remove: (id) => {
    const all = ContactService.getAll();
    const updated = all.filter((c) => c.id !== id);
    writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);
    return updated;
  },

  update: (id, partial) => {
    const all = ContactService.getAll();
    const updated = all.map((c) =>
      c.id === id ? { ...c, ...sanitizeContact(partial) } : c
    );
    writeStorage(STORAGE_KEYS.CONTACT_LIST, updated);
    return updated.find((c) => c.id === id);
  },
};
export { ContactService, sanitizeContact };
