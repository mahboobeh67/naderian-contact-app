

function ContactList({contacts}) {
  console.log(contacts)
  return (
    <div>
      <h3>Contact List</h3>
      <ul>
        {contacts.map((contact) =>
           <li key={contact.id}>
            <p>
             {contact.firstName} 
          {contact.lastName} 
            </p>
            <p><span>📧</span>{contact.email}</p>
            <p><span>☎️</span>{contact.phone}</p>
          <button>🗑️</button>
          </li>)}
      </ul>
      
      </div>
  )
}

export default ContactList