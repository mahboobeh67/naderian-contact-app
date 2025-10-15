
function ContactItem ({data: {id, firstName, lastName, email, phone}, deleteHandler}){
   
    
    return(
        <>
          <li key={id}>
            <p>
             {firstName} 
          {lastName} 
            </p>
            <p>
              <span>📧</span>{email}
              </p>
            <p>
              <span>☎️</span>{phone}
              </p>
          <button onClick={() => deleteHandler(id)}>🗑️</button>
          </li>
        </>
    )

}
export default ContactItem;