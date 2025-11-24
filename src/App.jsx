// src/App.jsx
import { ContactsProvider, useContactsActions, useContacts } from "./features/contacts/context/ContactsContext.jsx";
import  ContactList  from "./features/contacts/components/ContactList.jsx";
import  ContactForm  from "./features/contacts/components/ContactForm.jsx";
import { Header } from "./shared/ui/Header.jsx";

function AppContent() {
  const { createContact, removeContact } = useContactsActions();
  const { contacts } = useContacts();

  return (
    <>
      <Header />
      <main style={{ padding: "1rem" }}>
        <ContactForm onValid={createContact} />
        <ContactList contacts={contacts} onDelete={removeContact} />
      </main>
    </>
  );
}

export default function App() {
  return (
    <ContactsProvider>
      <AppContent />
    </ContactsProvider>
  );
}

