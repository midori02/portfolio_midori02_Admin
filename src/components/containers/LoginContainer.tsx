import {FC, useEffect} from 'react';
import {useQuery} from "react-query";
import {useRouter} from 'next/router'

import {LoginTemplate} from '../../components/templates'
import { Loading } from '../utility'
import { admin } from '../../types/admin'

const LoginContainer:FC = () => {
  const router = useRouter()
  const { data: user, isLoading } = useQuery<admin>('auth')

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/')
    }
  }, [isLoading, user, router])

  if (isLoading) return <Loading />

  return <LoginTemplate/>
};

export default LoginContainer;
