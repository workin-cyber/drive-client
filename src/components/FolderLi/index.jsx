import { useState } from "react"
import { AiFillFolderOpen } from "react-icons/ai"
import styles from "../../App.module.css"

const FolderLi = ({ f, handleOpen, handleNameChange }) => {
   const [edit, setEdit] = useState()

   const openEdit = (e) => {
      e.stopPropagation()
      setEdit(true)
   }

   const submitChangeName = (e) => {
      setEdit()
      handleNameChange(f, e.target.value);
   }

   return (<li onDoubleClick={() => handleOpen(f)} className={styles.folderCard}>
      {edit ?
         <input className={styles.input} onBlur={submitChangeName} autoFocus defaultValue={f} name="newName" />
         :
         <span className={styles.fileName} onDoubleClick={openEdit}>{f}</span>
      }
      <AiFillFolderOpen />
   </li>)
}

export default FolderLi