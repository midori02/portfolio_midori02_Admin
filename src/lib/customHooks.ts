import React, { useCallback, useRef, SetStateAction, Dispatch } from 'react'
import { auth, storage } from '../firebase/index'
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

type ImageUploadOptions = {
  onStart?: () => void
  onFinish?: () => void
  onError?: (message: string) => void
}

export const useImageUpload = (
  update: Dispatch<SetStateAction<ImageType[] | undefined>>,
  imageName: string,
  options: ImageUploadOptions = {}
) => {
  const optionsRef = useRef(options)
  optionsRef.current = options

  return useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { onStart, onFinish, onError } = optionsRef.current
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      if (!file.type.startsWith('image/')) {
        const message = '画像ファイルを選択してください。'
        onError?.(message)
        return
      }

      onStart?.()

      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const length = 16
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map((n) => characters[n % characters.length])
        .join('')

      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          onError?.('ログイン情報が無効です。一度ログアウトして再ログインしてください。')
          return
        }
        await currentUser.getIdToken(true)

        const uploadRef = storage.ref(imageName).child(fileName)
        const snapshot = await uploadRef.put(file, { contentType: file.type })
        const downloadUrl = await snapshot.ref.getDownloadURL()
        const newImage: ImageType = { id: fileName, path: downloadUrl }
        update([newImage])
      } catch (err: unknown) {
        console.error(err)
        const code =
          typeof err === 'object' && err !== null && 'code' in err
            ? String((err as { code: string }).code)
            : ''
        let message =
          '画像のアップロードに失敗しました。ログイン状態と Firebase Storage の設定を確認してください。'
        if (code === 'storage/unauthorized' || code === 'storage/unauthenticated') {
          message =
            'Firebase Storage のルールで書き込みが拒否されています。Console → Storage → ルール で content/ と admin/ への write をログイン済みユーザーに許可してください。'
        }
        onError?.(message)
      } finally {
        onFinish?.()
      }
    },
    [update, imageName]
  )
}