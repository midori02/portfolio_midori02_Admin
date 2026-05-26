import {FC, useEffect} from 'react';
import {useRouter} from 'next/router'

import {LoginTemplate} from '../templates'
import { useAuthQuery } from '../../lib/authQuery'

const LoginContainer:FC = () => {
  const router = useRouter()
  const { data: user } = useAuthQuery()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return <LoginTemplate/>
};

export default LoginContainer;
