import styles from "./ContactItem.module.css";
function ContactItem({
  data: { id, firstName, lastName, email, phone },
  deleteHandler,
}) {
  return (
    
      <li className={styles.item}>
        <p>
          {firstName}
          {lastName}
        </p>
        <p>
          <span>📧</span>
          {email}
        </p>
        <p>
          <span>☎️</span>
          {phone}
        </p>
        <button onClick={() => deleteHandler(id)}>🗑️</button>
      </li>
   
  );
}
export default ContactItem;
