import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import { v4 } from "uuid";
import Modal from "./Modal";
import styles from "./Contact.module.css";
import ContactForm from "./ContactForm";

function Contact() {
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });
  const [alert, setAlert] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    type: "", // "single", "bulk", "edit"
    targetId: null,
  });

  const [contact, setContact] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [editingId, setEditingId] = useState(null);

  // بارگذاری مخاطبین از Local Storage هنگام لود صفحه
  useEffect(() => {
    localStorage.getItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // ذخیره مخاطبین در Local Storage بعد از هر تغییر
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  // پاک کردن خودکار alert بعد از 3 ثانیه
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // اعتبارسنجی هر فیلد
  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) message = "نام نمی‌تواند خالی باشد.";
        break;
      case "email":
        if (!value.trim()) message = "ایمیل الزامی است.";
        else if (!/\S+@\S+\.\S+/.test(value))
          message = "ایمیل واردشده معتبر نیست.";
        break;
      case "phone":
        if (!value.trim()) message = "شماره تلفن الزامی است.";
        else if (!/^09\d{9}$/.test(value))
          message = "شماره باید با 09 شروع شده و 11 رقم باشد.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setContact((c) => ({ ...c, [name]: value }));
    validateField(name, value);
  };

  const validate = () => {
    const newErrors = {};
    if (!contact.firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!contact.lastName.trim())
      newErrors.lastName = "نام خانوادگی الزامی است";
    if (!contact.email.trim()) newErrors.email = "ایمیل الزامی است";
    else if (!/\S+@\S+\.\S+/.test(contact.email))
      newErrors.email = "ایمیل واردشده معتبر نیست";
    if (!contact.phone.trim()) newErrors.phone = "شماره تماس الزامی است";
    else if (!/^09\d{9}$/.test(contact.phone))
      newErrors.phone = "شماره باید با 09 شروع شده و 11 رقم باشد";
    return newErrors;
  };

  // ذخیره تغییرات یا اضافه کردن مخاطب جدید
  const saveHandler = () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setAlert("⚠️ لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    if (editingId) {
      // باز کردن مودال تایید ویرایش
      setModal({ show: true, type: "edit", targetId: editingId });
    } else {
      // اضافه کردن مخاطب جدید بدون مودال
      const newContact = { ...contact, id: v4() };
      setContacts([...contacts, newContact]);
      setContact({ id: "", firstName: "", lastName: "", email: "", phone: "" });
      setErrors({});
      setAlert("✅ مخاطب جدید اضافه شد!");
    }
  };

  // تایید نهایی ویرایش
  const confirmEdit = () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setAlert("⚠️ لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    const updatedContacts = contacts.map((c) =>
      c.id === modal.targetId ? contact : c
    );
    setContacts(updatedContacts);
    setModal({ show: false, type: "", targetId: null });
    setContact({ id: "", firstName: "", lastName: "", email: "", phone: "" });
    setEditingId(null);
    setErrors({});
    setAlert("✅ تغییرات مخاطب با موفقیت ذخیره شد!");
  };

  const deleteHandler = (id) => {
    setModal({ show: true, type: "single", targetId: id });
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

  const editHandler = (id) => {
    const editable = contacts.find((c) => c.id === id);
    setContact(editable);
    setEditingId(id);
  };

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
  };

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = contact.email.toLowerCase();
    const term = search.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  const isFormValid =
    Object.values(errors).every((err) => err === "") &&
    contact.firstName &&
    contact.lastName &&
    contact.email &&
    contact.phone;
  const MODAL_MESSAGES = {
    single: "آیا از حذف این مخاطب مطمئن هستید؟",
    bulk: "آیا از حذف مخاطبین انتخاب‌شده مطمئن هستید؟",
    edit: "آیا می‌خواهید تغییرات را ذخیره کنید؟",
  };
const handleFormChange = (name, value, errorMessage) => {
  setContact((prev) => ({ ...prev, [name]: value }));
  setErrors((prev) => ({ ...prev, [name]: errorMessage }));
};

  return (
    <div className={styles.container}>
      <Modal
        show={modal.show}
        message={MODAL_MESSAGES[modal.type]}
        onConfirm={modal.type === "edit" ? confirmEdit : confirmDelete}
        onCancel={() => setModal({ show: false, type: "", targetId: null })}
      />

      {/* فرم اضافه/ویرایش */}
<ContactForm
  contact={contact}
  errors={errors}
  onChange={handleFormChange}
  saveHandler={saveHandler}
  isFormValid={isFormValid}
  editingId={editingId}
  selectedIds={selectedIds}
  bulkDeleteHandler={bulkDeleteHandler}
/>



      {/* پیام‌ها */}
      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>

      {/* جستجو */}
      <input
        type="text"
        placeholder="🔍 جستجو بر اساس نام، نام خانوادگی یا ایمیل"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      {/* لیست مخاطبین */}
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
