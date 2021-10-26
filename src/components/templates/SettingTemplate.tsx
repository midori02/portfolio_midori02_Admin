import {FC,useState,useEffect} from 'react';
import {useMutation,useQueryClient} from 'react-query'
import {Box,Container,Typography,Divider} from '@mui/material'

import { admin } from "../../types/admin";
import {TextInput,DateInput} from '../Inputs'
import {ImageUploader} from '../image'
import {PrimaryButton} from "../Buttons";
import {useStringChangeEvent} from '../../lib/customHooks'
import {updateAdmin} from '../../lib/admin'

type Props ={
  admin:admin
}

const SettingTemplate:FC<Props> = (props) => {
  const {admin} = props
  const queryClient = useQueryClient()
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [image,setImage] = useState(undefined)
  const [year,setYear] = useState('2021')
  const [month,setMonth] = useState('1')
  const [text,setText] = useState('')

  useEffect(() => {
    if(!admin) return
    setName(admin.name)
    setDescription(admin.description)
    setImage(admin.image)
  },[admin])

  const updateMutate = useMutation(() =>updateAdmin(admin.admin_id,name,description,image),{
    onSuccess:() => {
      queryClient.invalidateQueries('auth')
      alert('更新が完了しました。')
    }
  })
  return (
    <Container sx={{display:'flex',minHeight:'100vh'}}>
      <Box width={'50%'}>
        <Box display={'flex'} justifyContent={'center'}>
          <ImageUploader image={image} setImage={setImage} imageName={'admin'}/>
        </Box>
        <TextInput
          margin={'normal'}
          label={'Name'}
          value={name}
          onChange={useStringChangeEvent(setName)}
        />
        <TextInput
          margin={'normal'}
          label={'Description'}
          value={description}
          onChange={useStringChangeEvent(setDescription)}
          multiline={true}
          rows={4}
        />
        <Box width={'200px'} margin={'auto'} paddingTop={'30px'}>
          <PrimaryButton text={'内容を更新'} onClick={() => updateMutate.mutate()}/>
        </Box>
        <Divider sx={{margin:'32px 0'}}/>
        <Box>
          <Typography sx={{marginBottom:'16px'}} variant={'h6'}>Create Histories</Typography>
          <DateInput
            year={year}
            month={month}
            setYear={useStringChangeEvent(setYear)}
            setMonth={useStringChangeEvent(setMonth)}
          />
          <TextInput
            margin={'normal'}
            label={'History text'}
            value={text}
            onChange={useStringChangeEvent(setText)}
            multiline={true}
            rows={2}
          />
          <Box width={'200px'} margin={'auto'} paddingTop={'30px'}>
            <PrimaryButton text={'作成する'} onClick={() => alert('test')}/>
          </Box>
        </Box>
      </Box>
      <Box width='50%' textAlign={'center'}>
        <Typography variant={'h4'}>Histories</Typography>
      </Box>
    </Container>
  );
};

export default SettingTemplate;
