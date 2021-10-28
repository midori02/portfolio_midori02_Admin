import {FC,useState,useEffect} from 'react';
import {useMutation,useQueryClient} from 'react-query'
import {Box,Container,Typography,Divider} from '@mui/material'

import { admin } from "../../types/admin";
import {History} from '../../types/histories'
import {TextInput,DateInput} from '../Inputs'
import {ImageUploader} from '../image'
import {PrimaryButton} from "../Buttons";
import {HistoryCard} from '../Cards'
import {useStringChangeEvent} from '../../lib/customHooks'
import {updateAdmin} from '../../lib/admin'
import {createHistory,updateHistoryRole,removeHistory} from '../../lib/histories'

type Props ={
  admin:admin
  histories:History[]
}

const SettingTemplate:FC<Props> = (props) => {
  const {admin,histories} = props
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

  const historyMutate = useMutation(() => createHistory(
    {
      admin_id:admin.admin_id,
      event:text,
      year:Number(year),
      month:Number(month),
      role:histories.length + 1
    }),
    {
      onSuccess:() => {
        queryClient.invalidateQueries('histories')
        alert('作成しました。')
        setText('')
        setYear('2021')
        setMonth('1')
      }
    }
  )

  const deleteMutate = useMutation(
    ( data:{ adminId : string , id : string,currentNum:number,deleteNum:number }) => removeHistory(data.adminId,data.id,data.currentNum,data.deleteNum),{
      onSuccess:() => {
        queryClient.invalidateQueries('histories')
      }
    })

  const historyUpdateRoleMutate = useMutation(
    (roleData:{
      adminId:string,
      historyId:string,
      update:number,
      currentNum:number
    }) => updateHistoryRole(roleData.adminId,roleData.historyId,roleData.update,roleData.currentNum),{
      onSuccess:() => {
        queryClient.invalidateQueries('histories')
      }
    })

  return (
    <Container sx={{display:'flex',minHeight:'100vh'}}>
      <Box width={'50%'} padding={'0 32px 0 16px'}>
        <Box display={'flex'} justifyContent={'center'} minHeight={'300px'} >
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
            <PrimaryButton text={'作成する'} onClick={() => historyMutate.mutate()}/>
          </Box>
        </Box>
      </Box>
      <Box sx={{borderLeft:'1px solid black'}} width='50%' textAlign={'center'} paddingLeft={'32px'}>
        <Typography variant={'h4'}>Histories</Typography>
        <Box margin={'32px 0'} >
          {histories && histories.length > 0 ?
            histories.map((history) => (
              <HistoryCard
                key={history.history_id}
                length={histories.length}
                upRole={() => historyUpdateRoleMutate.mutate( {
                  adminId:history.admin_id ,
                  historyId:history.history_id ,
                  update:history.role - 1 ,
                  currentNum:history.role
                })}
                downRole={() => historyUpdateRoleMutate.mutate( {
                  adminId:history.admin_id ,
                  historyId:history.history_id ,
                  update:history.role + 1 ,
                  currentNum:history.role
                })}
                history={history}
                deleteFunc={() => deleteMutate.mutate({
                  adminId:history.admin_id,
                  id:history.history_id,
                  currentNum:histories.length,
                  deleteNum:history.role
                })}
              />
            ))
            :<Typography>Histories not found...</Typography>
          }
        </Box>
      </Box>
    </Container>
  );
};

export default SettingTemplate;
