import React,{VFC,useCallback} from 'react';
import Image from 'next/image'
import {Box,Typography} from '@mui/material'
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import {ImageType} from '../../types/image'
import {useImageUpload} from '../../lib/customHooks'

type Props = {
  image: ImageType[] | undefined
  setImage: React.Dispatch<React.SetStateAction<ImageType[]>>
  imageName: string
  height?: number
  width?: number
}

const ImageUploader:VFC<Props> = (props) => {
  const { image, setImage, imageName, height = 250, width = 250 } = props
  const imageUpload = useImageUpload(setImage, imageName)

  const deleteImage = useCallback(() => {
    if (!window.confirm('この画像を削除しますか？')) return false
    setImage(undefined)
  }, [image])

  return (
    <Box margin={"auto"} >
      {image && image.length > 0 ?
        <Box sx={{display:'flex',justifyContent:'center',cursor:"pointer",'&:hover': { opacity: [0.9, 0.8, 0.7],
          }}}>
          <Box>
            <Image
              className="cursor-pointer"
              src={image[0].path}
              height={height}
              width={width}
              onClick={deleteImage}
              objectFit={'cover'}
            />
            <Typography sx={{color:'red'}}>※画像をクリックで削除</Typography>
          </Box>
        </Box>:
        <Box display={"flex"} justifyContent={"center"} sx={{'&:hover': { opacity: [0.9, 0.8, 0.7],
          }}}>
            <label htmlFor='image'>
              <Box sx={{cursor:"pointer",display:'flex',justifyContent:'center'}} >
                <ImageSearchIcon sx={{width:'42px',height:'42px'}} />
                <Typography sx={{paddingTop:'16px'}} variant='body1'>画像を選択</Typography>
              </Box>
            </label>
            <input id='image' hidden type="file" onChange={imageUpload} />
        </Box>
      }
    </Box>
  );
};

export default ImageUploader;
