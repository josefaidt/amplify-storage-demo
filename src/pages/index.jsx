import { useState, useEffect } from 'react'
import { Storage } from 'aws-amplify'
import ImageGrid from './_components/image-grid'
import * as s from './index.module.css'

export default function HomePage() {
  const [imageList, setImageList] = useState([])
  const [preview, setPreview] = useState()
  const [error, setError] = useState()
  const [message, setMessage] = useState()

  async function listImages() {
    try {
      const result = await Storage.list('images/')
      setImageList(result)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    listImages()
  }, [])

  useEffect(() => {
    let timer
    if (message) {
      timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [message])

  async function onSubmit(event) {
    setError()
    setMessage()
    event.preventDefault()

    const file = event.target.file.files[0]
    const key = `images/${file.name}`
    try {
      await Storage.put(key, file, {
        contentType: 'image/png', // contentType is optional
      })
      setMessage('Successfully uploaded')
      listImages()
    } catch (error) {
      console.log('Error uploading file: ', error)
      // set the error
      setError(error.message)
    }
    // clear the file input
    event.target.file.value = null
    setPreview(null)
  }
  async function onChange(event) {
    const file = event.target.files[0]
    // set preview to render file input as preview
    setPreview(URL.createObjectURL(file))
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" id="file" onChange={onChange} />
        <button type="submit">Submit upload</button>
      </form>
      {message && (
        <div className={s.message}>
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div className={s.error}>
          <p>{error}</p>
        </div>
      )}
      {preview && (
        <img src={preview} alt="uploaded image preview" className={s.img} />
      )}
      <ImageGrid imageList={imageList} />
    </div>
  )
}
