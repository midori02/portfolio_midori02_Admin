import React, { useCallback, SetStateAction, Dispatch } from 'react'
import { storage } from '../firebase/index'
import { ImageType } from '../types/image'

//文字列に対するonChangeに使用
export const useStringChangeEvent = (update: Dispatch<SetStateAction<string>>) => {
  return useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      update(event.target.value)
    },
    [update]
  )
}

//selectBoxに対するonChangeに使用
export const useSelect = (update: Dispatch<SetStateAction<string>>) => {
  return useCallback(
    (value: string) => {
      update(value)
    },
    [update]
  )
}

//checkBoxに対するonChangeに使用(string[])
export const useCheckBox = (state: string[], update: React.Dispatch<React.SetStateAction<string[]>>) => {
  return useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueName = event.target.name
      if (state.some((data) => data === valueName)) {
        const nextState = state.filter((data) => data !== valueName)
        update([...nextState])
      } else {
        update((prevState) => [...prevState, valueName])
      }
    },
    [state, update]
  )
}

export const useImageUpload = (update: Dispatch<SetStateAction<ImageType[]>>, imageName: string) => {
  return useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file: File = event.target.files[0]
      const blob = new Blob([file], { type: file.type })

      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const length = 16
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map((n) => characters[n % characters.length])
        .join('')

      const uploadRef = storage.ref(imageName).child(fileName)
      const uploadTask = uploadRef.put(blob)
      uploadTask.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((downloadUrl) => {
            const newImage = { id: fileName, path: downloadUrl }
            update((prevState) => (prevState ? [...prevState, newImage] : [newImage]))
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    [update]
  )
}