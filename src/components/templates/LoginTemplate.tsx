import {VFC,useState} from 'react';
import { Container,Box,Avatar,Typography,CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useMutation} from 'react-query'
import {useRouter} from 'next/router'

import {TextInput} from '../Inputs'
import {PrimaryButton} from '../Buttons'
import {useStringChangeEvent} from '../../lib/customHooks'
import {logIn} from '../../lib/auth'

const LoginTemplate:VFC = () => {
  const router = useRouter()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const loginMutate = useMutation(logIn, {
    onSuccess:() => {
      router.push('/')
    },
    onError: (error) => {
      const handle = error === undefined ? 'ユーザーが見つかりません。': 'ログインに失敗しました。'
      alert(handle)
    },
  })
  return (
    <Container maxWidth='sm' component="main">
      <Box
        sx={{
          marginTop: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CssBaseline />
        <Avatar sx={{backgroundColor:'black',m:1}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h4" sx={{margin:'0 0 48px 0'}}>
          Login
        </Typography>
        <Box sx={{width:"100%",marginBottom:"48px"}}>
          <TextInput placeholder={'sample@sample.com'} label={'Email'} onChange={useStringChangeEvent(setEmail)} value={email}/>
        </Box>
        <Box sx={{width:"100%",marginBottom:"48px"}}>
          <TextInput type={'password'} placeholder={'半角6文字以上で入力'} label={'Password'} onChange={useStringChangeEvent(setPassword)} value={password}/>
        </Box>
        <PrimaryButton text={'login'} onClick={() => loginMutate.mutate({email,password})}/>
      </Box>
    </Container>
  );
};

export default LoginTemplate;
