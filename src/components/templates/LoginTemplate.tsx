import {VFC,useState} from 'react';
import { Container,Box,Avatar,Typography,CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useMutation, useQueryClient} from 'react-query'
import {useRouter} from 'next/router'

import {TextInput} from '../Inputs'
import {PrimaryButton} from '../Buttons'
import {useStringChangeEvent} from '../../lib/customHooks'
import {logIn} from '../../lib/auth'
import { AUTH_QUERY_KEY } from '../../lib/authQuery'

const LoginTemplate:VFC = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const onEmailChange = useStringChangeEvent(setEmail)
  const onPasswordChange = useStringChangeEvent(setPassword)

  const loginMutate = useMutation(logIn, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(AUTH_QUERY_KEY)
      router.push('/')
    },
    onError: () => {
      alert('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
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
          <TextInput placeholder={'sample@sample.com'} label={'Email'} onChange={onEmailChange} value={email}/>
        </Box>
        <Box sx={{width:"100%",marginBottom:"48px"}}>
          <TextInput type={'password'} placeholder={'半角6文字以上で入力'} label={'Password'} onChange={onPasswordChange} value={password}/>
        </Box>
        <PrimaryButton text={'login'} onClick={() => loginMutate.mutate({email,password})}/>
        <Box sx={{width:'100%', marginTop: 2}}>
          <PrimaryButton
            text={'パスワードを忘れた方（再設定メールを送る）'}
            variant={'text'}
            color={'inherit'}
            onClick={() => router.push('/login/reset')}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginTemplate;
