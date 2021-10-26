import {FC,useEffect} from 'react';
import {useQueryClient} from "react-query";
import {useRouter} from 'next/router'

import {LoginTemplate} from '../../components/templates'
import { admin } from "../../types/admin";

const LoginContainer:FC = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const user:admin = queryClient.getQueryData('auth')
  if(user) {
    router.push('/')
  }
  return <LoginTemplate/>
};

export default LoginContainer;
