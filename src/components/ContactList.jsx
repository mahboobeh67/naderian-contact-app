import ContactItem from "./ContactItem";
import styles from "./ContactList.module.css";

function ContactList({ contacts, deleteHandler, editHandler }) {
  
  return (
    <div className={styles.container}>
      <h3>📒 لیست مخاطبین</h3>

      {contacts.length ? (
        <ul className={styles.contacts}>
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              data={contact}
              deleteHandler={deleteHandler}
              editHandler={editHandler}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.message}>📭 هنوز هیچ مخاطبی اضافه نشده!</p>
      )}
    </div>
  );
}

export default ContactList;
