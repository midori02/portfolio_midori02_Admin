import React, { FC } from 'react'
import { useQuery,useQueryClient } from 'react-query'
import { listenAuthState } from '../../lib/auth'
import { Loading } from '../utility'
import Router from 'next/router'

const Auth: FC = ({ children }) => {
  const { data,isLoading } = useQuery('auth', () => listenAuthState())
  if(isLoading) return <Loading/>

  if (data || Router.pathname === '/login') {
    return <>{children}</>
  } else {
    Router.push('/login')
    return <></>
  }
}

export default Auth
