import { useState } from "react";
import Contact from "./components/Contact.jsx";
import Header from "./components/Header.jsx";

function App() {
  const [contacts, setContacts] = useState([]);
  const deleteContact = (contact) => {
    setContacts((prevContacts) =>
      prevContacts.filter((item) => item.id !== contact.id)
    );
  };
  return (
    <>
      <Header />
      <Contact contacts={contacts} setContacts={setContacts} onDelete={deleteContact} />
    </>
  );
}

export default App;
