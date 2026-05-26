import React, { VFC, useCallback, useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import ImageSearchIcon from '@mui/icons-material/ImageSearch'

import { ImageType } from '../../types/image'
import { isAllowedImageUrl } from '../../lib/imageUtils'
import { useImageUpload } from '../../lib/customHooks'

type Props = {
  image: ImageType[] | undefined
  setImage: React.Dispatch<React.SetStateAction<ImageType[] | undefined>>
  imageName: string
  height?: number
  width?: number
  /** プレビュー表示。編集画面では全体が見える contain を推奨 */
  fit?: 'cover' | 'contain'
}

const ImageUploader: VFC<Props> = (props) => {
  const { image, setImage, imageName, height = 250, width = 250, fit = 'contain' } = props
  const inputId = `image-upload-${imageName}-${useId().replace(/:/g, '')}`
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  const imagePath = image?.[0]?.path
  const canPreview = !!imagePath && isAllowedImageUrl(imagePath) && !loadFailed

  useEffect(() => {
    setLoadFailed(false)
  }, [imagePath])

  const imageUpload = useImageUpload(setImage, imageName, {
    onStart: () => {
      setErrorMessage(null)
      setLoadFailed(false)
      setIsUploading(true)
    },
    onFinish: () => setIsUploading(false),
    onError: (message) => setErrorMessage(message),
  })

  const deleteImage = useCallback(() => {
    if (!window.confirm('この画像を削除しますか？')) return
    setImage(undefined)
    setErrorMessage(null)
    setLoadFailed(false)
  }, [setImage])

  const picker = (
    <label htmlFor={inputId}>
      <Box
        sx={{
          cursor: isUploading ? 'wait' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isUploading ? 0.6 : 1,
          '&:hover': { opacity: isUploading ? 0.6 : [0.9, 0.8, 0.7] },
        }}
      >
        {isUploading ? (
          <CircularProgress size={42} sx={{ my: 1 }} />
        ) : (
          <ImageSearchIcon sx={{ width: '42px', height: '42px' }} />
        )}
        <Typography sx={{ paddingTop: '16px' }} variant="body1">
          {isUploading ? 'アップロード中…' : '画像を選択'}
        </Typography>
      </Box>
      <input
        id={inputId}
        hidden
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={imageUpload}
      />
    </label>
  )

  return (
    <Box margin="auto">
      {canPreview ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': { opacity: [0.9, 0.8, 0.7] },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width,
              height,
              overflow: 'hidden',
              borderRadius: 1,
              backgroundColor: '#f0f0f0',
            }}
            onClick={deleteImage}
          >
            <Image
              src={imagePath}
              alt={imageName || 'profile image'}
              fill
              sizes={`${width}px`}
              style={{ objectFit: fit }}
              onError={() => setLoadFailed(true)}
            />
          </Box>
          <Typography sx={{ color: 'red', mt: 1 }}>※画像をクリックで削除</Typography>
        </Box>
      ) : (
        <Box>
          {imagePath && (loadFailed || !isAllowedImageUrl(imagePath)) && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              保存済みの画像を表示できません。再度アップロードしてください。
            </Alert>
          )}
          {picker}
        </Box>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  )
}

export default ImageUploader
