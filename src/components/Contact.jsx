import { useState } from "react";
import ContactList from "./ContactList";
import inputs from "../constants/inputs";
import { v4 } from "uuid";
import styles from "./Contact.module.css";

function Contact({ contacts, setContacts }) {
  const [alert, setAlert] = useState("");
  const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");

  const [contact, setContact] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setContact((contact) => ({ ...contact, [name]: value }));
  };

  const addHandler = () => {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone) {
      setAlert("⚠️ لطفاً تمام فیلدها را به درستی پر کنید!");
      return;
    }

    if (editingId) {
      // ✏️ ویرایش مخاطب
      const updatedContacts = contacts.map((item) =>
        item.id === editingId ? { ...contact, id: editingId } : item
      );
      setContacts(updatedContacts);
      setEditingId(null);
      setAlert("✅ مخاطب با موفقیت ویرایش شد!");
    } else {
      // ➕ افزودن مخاطب جدید
      const newContact = { ...contact, id: v4() };
      setContacts([...contacts, newContact]);
      setAlert("✅ مخاطب جدید اضافه شد!");
    }

    setContact({ id: "", firstName: "", lastName: "", email: "", phone: "" });
  };

  const deleteHandler = (id) => {
    const newList = contacts.filter((c) => c.id !== id);
    setContacts(newList);
    setAlert("🗑️ مخاطب با موفقیت حذف شد!");
  };

  const editHandler = (id) => {
    const editable = contacts.find((c) => c.id === id);
    setContact(editable);
    setEditingId(id);
    setAlert("✏️ در حال ویرایش مخاطب انتخاب‌شده...");
  };
const filteredContacts = contacts.filter((contact) => {
  const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
  const email = contact.email.toLowerCase();
  const term = search.toLowerCase();

  return (
    fullName.includes(term) ||
    email.includes(term)
  );
});

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            value={contact[input.name]}
            onChange={changeHandler}
          />
        ))}
        <button onClick={addHandler}>
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
      </div>

      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>
      <input
  type="text"
  placeholder="🔍 جستجو بر اساس نام، نام خانوادگی یا ایمیل"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className={styles.search}
/>


      <ContactList
         contacts={filteredContacts}
  deleteHandler={deleteHandler}
  editHandler={editHandler}
      />
    </div>
  );
}

export default Contact;
