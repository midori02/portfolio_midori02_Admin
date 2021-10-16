import {FC,useState} from 'react';
import {useRouter} from 'next/router'
import { Box,Typography,Divider } from "@mui/material";
import {useMutation} from 'react-query'

import {ImageUploader} from '../image'
import {TextInput,SelectBox,CheckBox,DateInput,PrimarySwitch} from '../Inputs'
import {PrimaryButton} from '../Buttons'
import {useStringChangeEvent,useSelect,useCheckBox} from '../../lib/customHooks'
import {createContent} from '../../lib/contents'
import {genreData,skillData} from '../../lib/datas'
import * as React from "react";


const ContentTemplate:FC = () => {
  const router = useRouter()
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [url,setUrl] = useState('')
  const [genre,setGenre] = useState('')
  const [skills,setSkills] = useState([])
  const [startYear,setStartYear] = useState('2021')
  const [startMonth,setStartMonth] = useState('1')
  const [endYear,setEndYear] = useState('2021')
  const [endMonth,setEndMonth] = useState('1')
  const [inProduction,setInProduction] = useState(false)
  const [image,setImage] = useState(undefined)

  const createMutate = useMutation(() => createContent(
    'mTLZenxmFraMwlT5FMjbfPpCCaf2',
    image,
    title,
    description,
    genre,
    skills,
    Number(startYear),
    Number(startMonth),
    Number(endYear),
    Number(endMonth),
    inProduction,
    url
  ),{
    onSuccess:() => {
      router.push('/')
      setImage(undefined)
      setUrl('')
      setInProduction(false)
      setGenre('')
      setTitle('')
      setDescription('')
      setSkills([])
      setStartYear('2021')
      setStartMonth('1')
      setEndYear('2021')
      setEndMonth('1')
    }}
  )
  return (
      <>
        <Typography variant='h5'>Create Content</Typography>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Image</Typography>
          <ImageUploader image={image} setImage={setImage} imageName={'content'}/>
        </Box>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Title</Typography>
          <TextInput  label={'title'} onChange={useStringChangeEvent(setTitle)} value={title}/>
        </Box>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Description</Typography>
          <TextInput multiline={true} rows={5} label={'description'} onChange={useStringChangeEvent(setDescription)} value={description}/>
        </Box>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Url</Typography>
          <TextInput  label={'url'} onChange={useStringChangeEvent(setUrl)} value={url}/>
        </Box>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Genres</Typography>
          <SelectBox options={genreData} select={useSelect(setGenre)} value={genre}/>
        </Box>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Skills</Typography>
          <Box width={'100%'}>
            <CheckBox state={skills} values={skillData} onChange={useCheckBox(skills,setSkills)}/>
          </Box>
        </Box>
        <Divider/>
        <Box sx={{marginTop:'24px',paddingRight:'16px'}} display={"flex"} justifyContent={"space-between"}>
          <Typography variant='h6'>Setting Period</Typography>
          <PrimarySwitch  checked={inProduction} setChecked={setInProduction} onText={'in production'} offText={'end'}/>
        </Box>
        <Box sx={{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>Start Date</Typography>
          <DateInput year={startYear} month={startMonth} setYear={useStringChangeEvent(setStartYear)} setMonth={useStringChangeEvent(setStartMonth)}/>
        </Box>
        <Box sx={inProduction === true ?{display:'none'}:{display:'flex', margin:'32px 0',paddingLeft:"20px"}}>
          <Typography sx={{width:'240px'}} variant='body1'>End Date</Typography>
          <DateInput year={endYear} month={endMonth} setYear={useStringChangeEvent(setEndYear)} setMonth={useStringChangeEvent(setEndMonth)}/>
        </Box>
        <Box display={"flex"} justifyContent={"center"}>
          <PrimaryButton text={'Create Content'} onClick={() => createMutate.mutate()}/>
        </Box>

      </>
  );
};

export default ContentTemplate;
