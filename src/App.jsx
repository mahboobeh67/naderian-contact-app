import { useState } from "react";
import Contact from "./components/Contact.jsx";
import Header from "./components/Header.jsx";

function App() {
 const [contacts, setContacts] = useState(() => {
  const saved = localStorage.getItem("contacts");
  return saved ? JSON.parse(saved) : [];
});

  const [showForm, setShowForm] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const deleteContact = (contact) => {
    setContacts((prevContacts) =>
      prevContacts.filter((item) => item.id !== contact.id)
    );
  };

  // ✳️ افزودن مخاطب
  const handleAdd = () => {
    setShowForm((prev) => !prev);
    setSelectMode(false); // وقتی فرم باز شد، حالت انتخاب بسته شود
  };

  // ✳️ فعال‌سازی حالت انتخاب
  const handleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setShowForm(false); // وقتی انتخاب فعال شد، فرم بسته شود
  };

  return (
    <>
      <Header
        onAdd={handleAdd}
        onSelectMode={handleSelectMode}
        showForm={showForm}
        selectMode={selectMode}
      />
      <Contact
        contacts={contacts}
        setContacts={setContacts}
        onDelete={deleteContact}
        showForm={showForm}
        setShowForm={setShowForm}
        selectMode={selectMode}
      />
    </>
  );
}

export default App;
