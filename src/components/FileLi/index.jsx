import axios from "axios"
import { useState } from "react"
import { AiFillDelete, AiOutlineFileText } from "react-icons/ai"
import { HiOutlinePhotograph } from "react-icons/hi"
import { FiEdit2, FiMoreVertical } from "react-icons/fi"
import { baseUrl } from "../../App"
import styles from "../../App.module.css"
import { IoInformationOutline } from "react-icons/io5"
import { MdOutlineSimCardDownload } from "react-icons/md"


const isPhoto = (str) => str.includes(".png") || str.includes(".jpg")
const isText = (str) => str.includes(".doc") || str.includes(".txt")

const FileLi = ({ f, path, handleNameChange, deleteHandler }) => {
   const
      [edit, setEdit] = useState(),
      [options, setOptions] = useState(),
      [details, setDetailes] = useState()

   const openEdit = (e) => {
      e.stopPropagation()
      setEdit(true)
      setOptions()
      setDetailes()
   }

   const submitChangeName = (e) => {
      setEdit()
      handleNameChange(f, e.target.value);
   }

   const downloadFile = (data) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', f);
      document.body.appendChild(link);
      link.click();
   }

   const handleDownload = () => {
      axios({
         url: baseUrl + "download/path" + path + "/" + f,
         method: 'GET',
         responseType: 'blob',
      }).then(({ data }) => downloadFile(data))
         .catch(err => console.log(err))
   }

   const handleDetails = () => axios.get(baseUrl + "stats/path" + path + "/" + f)
      .then(({ data }) => setDetailes(data))
      .catch(err => console.log(err))



   const handleDelete = () => {
      setOptions()
      deleteHandler(f, "file")
   }

   const handleOptions = () => {
      setDetailes()
      setOptions(!options)
   }

   return (
      <li onDoubleClick={() => handleDownload(f)} className={styles.folderCard}>
         <button onClick={handleOptions} className={styles.moreBtn}> <FiMoreVertical /> </button>

         {edit ?
            <input className={styles.input} onBlur={submitChangeName} autoFocus defaultValue={f} name="newName" />
            :
            <span className={styles.fileName} onDoubleClick={openEdit}>{f}</span>
         }
         {isText(f) && <AiOutlineFileText />}
         {isPhoto(f) && <HiOutlinePhotograph />}

         {options &&
            <ul className={styles.options}>
               {!details ?
                  <>
                     <li onClick={openEdit}><span><FiEdit2 /></span>rename</li>
                     <li onClick={handleDelete}><span><AiFillDelete /></span>delete</li>
                     <li onClick={handleDetails}><span><IoInformationOutline /></span>details</li>
                     <li onClick={handleDownload}><span><MdOutlineSimCardDownload /></span>download</li>
                  </> : <>
                     <li><h5>size: </h5>{details.size}</li>
                     <li><h5>create at: </h5>{new Date(details.birthtimeMs).toDateString()}</li>
                  </>
               }
            </ul>}
      </li>)
}

export default FileLi