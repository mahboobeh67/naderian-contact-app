import styles from "./Modal.module.css";

function Modal({ show, message, onConfirm, onCancel, type }) {
  if (!show) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          {type === "edit" ? "ویرایش مخاطب" : "حذف مخاطب"}
        </h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm}>
            <span>✔️ بله</span>
          </button>
          <button
            className={styles.cancel}
            onClick={() => {
              onCancel();
              // نمایش پیام انصراف
              const alertBox = document.createElement("div");
              alertBox.className = styles.cancelAlert;
              alertBox.textContent = "❎ حذف لغو شد. هیچ تغییری اعمال نشد.";
              document.body.appendChild(alertBox);
              setTimeout(() => alertBox.remove(), 3000);
            }}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
