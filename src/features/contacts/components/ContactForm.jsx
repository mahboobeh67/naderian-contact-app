import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContacts } from "../context/ContactsContext";
import { contactSchema } from "../utils/validateContact";
import * as actions from "../actions";

export default function ContactForm() {
  const { state, dispatch } = useContacts();
  const { currentContact, editingId } = state;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: currentContact,
  });

  // 🎯 وقتی editingId یا currentContact تغییر کنه فرم ریست میشه
  useEffect(() => {
    reset(currentContact);
  }, [currentContact, reset]);

  // 📤 ارسال فرم
  const onSubmit = async (data) => {
    if (editingId) {
      await actions.updateContact(dispatch)({ ...data, id: editingId });
    } else {
      await actions.createContact(dispatch)(data);
    }
    reset();
  };

  // 🔄 ذخیرهٔ موقت هر تغییر در localStorage (۵۰۰ms delay)
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        localStorage.setItem("draftContact", JSON.stringify(currentContact));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDirty, currentContact]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <div style={styles.inputGroup}>
        <input {...register("firstName")} placeholder="نام" />
        <span style={styles.error}>{errors.firstName?.message}</span>
      </div>

      <div style={styles.inputGroup}>
        <input {...register("lastName")} placeholder="نام خانوادگی" />
        <span style={styles.error}>{errors.lastName?.message}</span>
      </div>

      <div style={styles.inputGroup}>
        <input {...register("email")} placeholder="ایمیل" />
        <span style={styles.error}>{errors.email?.message}</span>
      </div>

      <div style={styles.inputGroup}>
        <input {...register("phone")} placeholder="شماره" />
        <span style={styles.error}>{errors.phone?.message}</span>
      </div>

      <button type="submit" style={styles.button}>
        {editingId ? "ویرایش مخاطب" : "افزودن مخاطب"}
      </button>
    </form>
  );
}

// 🌸 کمی استایل برای قشنگی
const styles = {
  form: { marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  inputGroup: { display: "flex", flexDirection: "column" },
  error: { color: "crimson", fontSize: "0.8rem" },
  button: {
    marginTop: "0.5rem",
    background: "#005c55",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
