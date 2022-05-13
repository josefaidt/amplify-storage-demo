import { useState, useEffect } from 'react'
import { Storage } from 'aws-amplify'
import cn from 'classnames'
import * as s from './image-grid.module.css'

export default function ImageGrid(props) {
  const { imageList } = props

  const [images, setImages] = useState([])

  async function listImages(list) {
    let result = []
    for (const image of list) {
      const url = await Storage.get(image.key)
      result.push({ ...image, url })
    }
    setImages(result)
  }

  useEffect(() => listImages(imageList), [imageList])

  return (
    <div className={s.container}>
      {images.map((image, index) => (
        <a key={image.key} href={image.url} className={s.a}>
          <figure className={s.figure}>
            <img src={image.url} className={cn(s.img, s.landscape)} />
            <figcaption>
              <span>{index}</span>
            </figcaption>
          </figure>
        </a>
      ))}
    </div>
  )
}
