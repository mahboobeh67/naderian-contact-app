import { useContacts } from "../context/ContactsContext";
import styles from "./ContactItem.module.css"
const ContactItem = ({ contact }) => {
  const { actions } = useContacts();

  return (
    <div className={styles.item}>
    
      <strong>{contact.firstName} {contact.lastName}</strong>  
      <br />
      <small>{contact.email}</small> | <small>{contact.phone}</small>

      <div className={styles.info}>
        <button className={styles.action} onClick={() => actions.startEditing(contact.id)}>ویرایش</button>
        <button className={styles.action} onClick={() => actions.deleteContact(contact.id)}>حذف</button>
      </div>
    </div>
  );
};

export default ContactItem;
