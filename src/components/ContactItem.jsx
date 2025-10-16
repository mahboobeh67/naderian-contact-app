import styles from "./ContactItem.module.css";

function ContactItem({
  data: { id, firstName, lastName, email, phone },
  deleteHandler,
  editHandler,
}) {
  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <p className={styles.name}>
          👤 {firstName} {lastName}
        </p>
        <p>
          <span>📧</span> {email}
        </p>
        <p>
          <span>☎️</span> {phone}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.edit}
          title="ویرایش مخاطب"
          onClick={() => editHandler(id)}
        >
          ✏️
        </button>

        <button
          className={styles.delete}
          title="حذف مخاطب"
          onClick={() => deleteHandler(id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default ContactItem;
