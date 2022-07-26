import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';

import LeftNav from './components/LeftNav';
import FolderLi from './components/FolderLi';
import FileLi from './components/FileLi';
import { AiOutlineCaretDown } from 'react-icons/ai';

export const baseUrl =  "https://aviad-drive.herokuapp.com/api/" //process.env.BASE_URL//
const isFile = (str) => str.includes(".")
const isFolder = (str) => !str.includes(".")


function App() {
  const
    [path, setPath] = useState(""),
    [filesInDir, setFilesInDir] = useState([]),
    [file, setFile] = useState(),
    [rows, setRows] = useState(),
    [error, setError] = useState()

  useEffect(() => { getFilesInDir() }, [path])

  console.log("app.js", filesInDir);
  console.log("app.js", path);
  console.log("app.js", file);


  const handleOpen = (f) => setPath((old) => `${old}/${f}`)

  const onBreadClick = (name) => setPath(old => old.split(name)[0] + name)

  const goBack = () => setPath((old) => old.slice(0, old.lastIndexOf("/")))

  const getFilesInDir = async () => axios.get(encodeURI(`${baseUrl}path${path}`))
    .then(({ data }) => setFilesInDir(data))
    .catch(error => handleError(error))

  const handleError = (error) => {
    setError(error?.response?.data || error?.message || error || "sorry something went wrong...")
    setTimeout(setError, 5000)
  }

  const handleSubmitAddFolder = async (e) => {
    const values = Object.values(e.target)
      .reduce((acc, curr) =>
        curr.name ? ({ ...acc, [curr.name]: curr.value }) : acc, {})

    try {
      if (filesInDir.includes(values.name))
        throw "this is already folder with that name"
      const { data } = await axios.post(`${baseUrl}add/folder/path${path}`, values)
      setFilesInDir(data)
    } catch (error) { handleError(error) }
  }

  const handleSubmitFileUploader = (e) => {
    const formData = new FormData()
    formData.append("file", file)

    axios.post(baseUrl + `upload/path${path}`, formData)
      .then(({ data }) => setFilesInDir(data))
      .catch(err => handleError(err))
  }

  const handleNameChange = (oldName, newPath) =>
    axios.put(baseUrl + `rename/path${path}/${oldName}`, { newPath: `${path}/${newPath}` })
      .then(({ data }) => setFilesInDir(data))
      .catch(err => handleError(err))

  const deleteHandler = (fileName, type) => {
    console.log(`${path}/${fileName}`);
    axios.delete(baseUrl + `${type}/delete/path${path}/${fileName}`)
      .then(({ data }) => setFilesInDir(data))
      .catch(err => handleError(err))
  }


  return (
    <div className="App">

      <div className={styles.nav}>
        <h2> yoosef<span>Drive</span></h2>
        {error && <p className={`${styles.rollIn} ${styles.error}`}>{error}</p>}
      </div>

      <main className={styles.main} >

        {/* nav */}
        <LeftNav {...{
          path, goBack, handleSubmitAddFolder,
          handleSubmitFileUploader, file, setFile, onBreadClick, setRows, rows
        }} />

        {/* main */}
        <div className={`${styles.container} ${rows ? styles.rows : ""}`}>
          {filesInDir.length > 0 ?
            <>
              <h5>names <span><AiOutlineCaretDown /></span></h5>
              <h4>folders</h4>
              <ul className={styles.list}>
                {filesInDir.filter(isFolder).map((f, i) =>
                  <FolderLi handleNameChange={handleNameChange} f={f} handleOpen={handleOpen} key={`f${i}`} />)}
              </ul>
              <h4>files</h4>
              <ul className={styles.list}>
                {filesInDir.filter(isFile).map((f, i) =>
                  <FileLi deleteHandler={deleteHandler} handleNameChange={handleNameChange} f={f} path={path} key={`f${i}`} />)}
              </ul>
            </>
            :
            <h3>this folder is empty...</h3>}

        </div>
      </main>
    </div>
  );
}

export default App;




