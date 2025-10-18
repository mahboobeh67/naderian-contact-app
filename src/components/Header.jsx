import styles from"./Header.module.css"
import AddButton from "./AddButton"

function Header({onAdd, onSelectMode, showForm, selectMode}) {
  return (
    <div className={styles.container}>
        <h1>📱Contact App Created by MahboobehNaderian❤️</h1>
        <p><a href="https://github.com/mahboobeh67/Naderian-tab-component">Github</a> | Contact app created by React.js </p>

         <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
      <AddButton
          icon={showForm ? "❌" : "➕"}
         
          onClick={onAdd}
          variant={showForm ? "red" : "gray"}
        />
        <AddButton
          label={selectMode ? "خروج از انتخاب" : "انتخاب"}
          onClick={onSelectMode}
          variant={selectMode ? "green" : "golden"}
        />
    </div>
        </div>
  )
}

export default Header