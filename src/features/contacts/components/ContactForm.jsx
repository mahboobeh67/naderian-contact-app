import styles from "./ContactForm.module.css";
import inputs from "../../../shared/constants/inputs"


function ContactForm({
  contact,
  errors,
  saveHandler,
  isFormValid,
  editingId,
  selectedIds,
  bulkDeleteHandler,
  onChange,
}) {
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
    return message;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    onChange(name, value, errorMessage); // به والد اطلاع می‌ده
  };

  return (
    <div className={styles.form}>
      {inputs.map((input, index) => (
        <div key={index} className={styles.inputGroup}>
          <input
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            value={contact[input.name]}
            onChange={handleChange}
            className={errors[input.name] ? styles.inputError : ""}
          />

          {errors[input.name] && (
            <span className={styles.errorText}>{errors[input.name]}</span>
          )}
        </div>
      ))}

      <button onClick={saveHandler} disabled={!isFormValid}>
        {editingId ? "ذخیره تغییرات" : "افزودن مخاطب"}
      </button>

      {selectedIds.length > 0 && (
        <button onClick={bulkDeleteHandler} className={styles.bulkDelete}>
          🗑️ حذف {selectedIds.length} مخاطب انتخاب‌شده
        </button>
      )}
    </div>
  );
}

export default ContactForm;
