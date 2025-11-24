// src/features/contacts/Contact.jsx
import { useState } from "react";
import { useContacts, useContactsActions } from "../../contexts/ContactsContext";
import Modal from "./Modal.jsx";
import ContactForm from "./ContactForm.jsx";
import ContactList from "./ContactList.jsx";
import styles from "./Contact.module.css";

export default function Contact({ showForm, setShowForm, selectMode }) {
  const { contacts } = useContacts();
  const { createContact, removeContact } = useContactsActions();

  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [modal, setModal] = useState({ show: false, type: "", targetId: null });

  // 🧩 پاک‌سازی پیام هشدار
  if (alert) {
    setTimeout(() => setAlert(""), 3000);
  }

  // 🔍 فیلتر جستجو
  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.name || contact.firstName} ${contact.lastName || ""}`.toLowerCase();
    const email = (contact.email || "").toLowerCase();
    const term = search.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  // 🧩 افزودن مخاطب جدید (از ContactForm)
  const handleAdd = (data) => {
    createContact(data);
    setAlert("✅ مخاطب جدید با موفقیت افزوده شد!");
    setShowForm(false);
  };

  // 🧩 ویرایش (فعلاً با Modal ساده؛ قابل گسترش)
  const handleEdit = (id) => {
    setModal({ show: true, type: "edit", targetId: id });
  };

  // 🧩 حذف تکی
  const handleDelete = (id) => {
    setModal({ show: true, type: "single", targetId: id });
  };

  // 🧩 تأیید حذف
  const confirmDelete = () => {
    if (modal.type === "single") {
      removeContact(modal.targetId);
      setAlert("🗑️ مخاطب حذف شد!");
    } else if (modal.type === "bulk") {
      selectedIds.forEach((id) => removeContact(id));
      setAlert("🗑️ مخاطبین انتخاب‌شده حذف شدند!");
      setSelectedIds([]);
    }
    setModal({ show: false, type: "", targetId: null });
  };

  // 🧩 انتخاب چندتایی
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const bulkDeleteHandler = () => {
    if (selectedIds.length === 0) return setAlert("⚠️ هیچ مخاطبی انتخاب نشده!");
    setModal({ show: true, type: "bulk", targetId: null });
  };

  const MODAL_MESSAGES = {
    single: "آیا از حذف این مخاطب مطمئن هستید؟",
    bulk: "آیا از حذف مخاطبین انتخاب‌شده مطمئن هستید؟",
    edit: "در حال حاضر امکان ویرایش غیرفعال است (در نسخه بعدی فعال می‌گردد).",
  };

  return (
    <div className={styles.container}>
      {/* 🧩 هشدار */}
      {alert && (
        <div className={styles.alert}>
          <p>{alert}</p>
        </div>
      )}

      {/* 🧩 مودال */}
      <Modal
        show={modal.show}
        message={MODAL_MESSAGES[modal.type]}
        onConfirm={confirmDelete}
        onCancel={() => setModal({ show: false, type: "", targetId: null })}
        type={modal.type}
      />

      {/* 🧩 فرم اضافه‌کردن مخاطب */}
      {showForm && (
        <ContactForm
          onValid={handleAdd}
          bulkDeleteHandler={bulkDeleteHandler}
          selectedIds={selectedIds}
        />
      )}

      {/* 🧩 فیلد جستجو */}
      <input
        type="text"
        className={styles.search}
        placeholder="🔍 جستجو بر اساس نام یا ایمیل..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🧩 لیست مخاطبین */}
      <ContactList
        contacts={filteredContacts}
        editHandler={handleEdit}
        deleteHandler={handleDelete}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        selectMode={selectMode}
      />
    </div>
  );
}
