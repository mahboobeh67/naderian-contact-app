import styles from "./AddButton.module.css";

function AddButton({ icon, label, onClick, variant = "gray" }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
}

export default AddButton;
