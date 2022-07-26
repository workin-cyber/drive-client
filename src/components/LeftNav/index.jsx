import React, { useRef, useState } from 'react'
import styles from "./style.module.css"

import { AiOutlineCloudUpload, AiOutlineFolderAdd, AiOutlineSend } from "react-icons/ai"
import { MdArrowUpward, MdTableRows } from "react-icons/md"
import { HiUpload } from "react-icons/hi"
import { BsFillGrid3X2GapFill } from "react-icons/bs"
import { IoReturnDownBackOutline } from "react-icons/io5"

function LeftNav({ path, goBack, handleSubmitAddFolder, handleSubmitFileUploader, file, setFile, onBreadClick, rows, setRows }) {
   const
      [openFolder, setOpenFolder] = useState(),
      [openFile, setOpenFile] = useState(),
      fileInputRef = useRef(null)

   const closeAllForms = () => {
      setOpenFile()
      setFile()
      setOpenFolder()
   }

   const openFolderClick = () => {
      setOpenFile()
      setOpenFolder(old => !old)
   }

   const openFileClick = () => {
      setOpenFolder()
      setOpenFile(old => !old)
   }

   const handleFormSubmit = (e, fn) => {
      closeAllForms()
      fn(e)
      e.preventDefault()
      e.target.reset()
   }


   return (
      <div className={styles.leftNav}>
         <div className={styles.bread}>
            {path && path.split("/").map(p => p ? <button onClick={() => onBreadClick(p)} key={p}>{`${p}`}<IoReturnDownBackOutline />  </button> : null)}
         </div>
         <div className={styles.btns}>
            <button className={styles.btn} disabled={!path} onClick={goBack}><MdArrowUpward /><p>go back</p></button>
            <button className={styles.btn} onClick={openFolderClick}><AiOutlineFolderAdd /><p>new folder</p></button>
            <button className={styles.btn} onClick={openFileClick}><AiOutlineCloudUpload /> <p> upload file</p></button>
            <button className={styles.btn} onClick={() => setRows(old => !old)}>{rows ? <BsFillGrid3X2GapFill /> : <MdTableRows />} <p> {rows ? "grid" : "rows"}</p></button>

            {openFolder &&
               <form onSubmit={(e) => handleFormSubmit(e, handleSubmitAddFolder)}>
                  <input name='name' placeholder='folder name...' />
                  <button className={styles.btn} type='submit'><AiOutlineSend /><p> submit</p></button>
               </form>}

            {openFile && <form onSubmit={(e) => handleFormSubmit(e, handleSubmitFileUploader)}>
               {file && <span>{file.name}</span>}
               <button type='button' onClick={() => fileInputRef.current.click()}><HiUpload /></button>
               <input type={"file"} name="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />
               <button className={styles.btn} type='submit'><AiOutlineSend /><p> submit</p></button>
            </form>}
         </div>
      </div>
   )
}

export default LeftNav