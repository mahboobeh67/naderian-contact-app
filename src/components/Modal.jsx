import styles from "./Modal.module.css";

function Modal({ show, message, onConfirm, onCancel }) {
  if (!show) return null; 

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm}>
            بله
          </button>
          <button className={styles.cancel} onClick={onCancel}>
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
