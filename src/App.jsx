// src/App.jsx
import React from "react";
import { ContactsProvider } from "./features/contacts/context/ContactsContext.jsx";
import ContactList from "./features/contacts/components/ContactList.jsx";
import ContactForm from "./features/contacts/components/ContactForm.jsx";
import { Header } from "./shared/ui/Header.jsx";

const App = () => {
  return (
    <ContactsProvider>
      <Header />
      <main style={{ padding: "1rem" }}>
        <ContactForm />
        <ContactList />
      </main>
    </ContactsProvider>
  );
};

export default App;


