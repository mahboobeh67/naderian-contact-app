import { useState } from "react";
import ContactList from "./ContactList";
import inputs from "../constants/inputs";
import { v4 } from "uuid";
import styles from "./Contact.module.css";

function Contact({ contacts, setContacts }) {
  const [alert, setAlert] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "", targetId: null });
  const [errors, setErrors] = useState({});

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
  const validate = () => {
    const newErrors = {};

    if (!contact.firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!contact.lastName.trim())
      newErrors.lastName = "نام خانوادگی الزامی است";

    if (!contact.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
      newErrors.email = "ایمیل واردشده معتبر نیست";
    }

    if (!contact.phone.trim()) {
      newErrors.phone = "شماره تماس الزامی است";
    } else if (!/^\d{10,}$/.test(contact.phone)) {
      newErrors.phone = "شماره تماس باید فقط عدد و حداقل ۱۰ رقم باشد";
    }

    return newErrors;
  };

  const addHandler = () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setAlert("⚠️ لطفاً خطاهای فرم را برطرف کنید");
      return;
    }
    setErrors({});
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
    setModal({ show: true, type: "single", targetId: id });
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

    return fullName.includes(term) || email.includes(term);
  });
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const bulkDeleteHandler = () => {
    if (selectedIds.length === 0) {
      setAlert("⚠️ هیچ مخاطبی انتخاب نشده!");
      return;
    }
    setModal({ show: true, type: "bulk", targetId: null });

    const newList = contacts.filter((c) => !selectedIds.includes(c.id));
    setContacts(newList);
    setSelectedIds([]); // پاک کردن تیک‌ها بعد از حذف
    setAlert("🗑️ مخاطبین انتخاب‌شده حذف شدند!");
  };
  const confirmDelete = () => {
    if (modal.type === "single") {
      setContacts(contacts.filter((c) => c.id !== modal.targetId));
      setAlert("🗑️ مخاطب حذف شد!");
    } else if (modal.type === "bulk") {
      setContacts(contacts.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      setAlert("🗑️ مخاطبین انتخاب‌شده حذف شدند!");
    }
    setModal({ show: false, type: "", targetId: null });
  };

  return (
    <div className={styles.container}>
      {modal.show && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <p>
              آیا از حذف{" "}
              {modal.type === "single" ? "این مخاطب" : "مخاطبین انتخاب‌شده"}{" "}
              مطمئن هستید؟
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.confirm}
                onClick={() => confirmDelete()}
              >
                بله، حذف کن
              </button>
              <button
                className={styles.cancel}
                onClick={() =>
                  setModal({ show: false, type: "", targetId: null })
                }
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.form}>
        {inputs.map((input, index) => (
          <div key={index} className={styles.inputWrapper}>
            <input
              type={input.type}
              placeholder={input.placeholder}
              name={input.name}
              value={contact[input.name]}
              onChange={changeHandler}
            />
            {errors[input.name] && (
              <p className={styles.error}>{errors[input.name]}</p>
            )}
          </div>
        ))}

        <button onClick={addHandler}>
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
        {selectedIds.length > 0 && (
          <button onClick={bulkDeleteHandler} className={styles.bulkDelete}>
            🗑️ حذف {selectedIds.length} مخاطب انتخاب‌شده
          </button>
        )}
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
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
      />
    </div>
  );
}

export default Contact;
