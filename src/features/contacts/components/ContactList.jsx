import styles from "./ContactList.module.css";
import AddButton from "../../../shared/ui/AddButton";
function ContactList({
  contacts = [],
  editHandler,
  deleteHandler,
  toggleSelect,
  selectedIds = [],
  selectMode = false,
}) {
  if (!contacts.length)
    return <p className={styles.empty}>📭 هنوز هیچ مخاطبی ثبت نشده!</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {selectMode && <th>انتخاب</th>}
          <th>نام</th>
          <th>نام خانوادگی</th>
          <th>ایمیل</th>
          <th>تلفن</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((c) => (
          <tr key={c.id}>
            {selectMode && (
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggleSelect(c.id)}
                />
              </td>
            )}
            <td>{c.firstName || c.name}</td>
            <td>{c.lastName}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>{c.age}</td>
            <td className={styles.actions}>
              <AddButton variant="secondary" onClick={() => editHandler(c.id)}>
                ویرایش
              </AddButton>
              <AddButton variant="danger" onClick={() => deleteHandler(c.id)}>
                حذف
              </AddButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContactList;
