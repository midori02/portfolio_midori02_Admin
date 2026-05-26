import React, { FC, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { fetchAuthUser, subscribeAuthState } from '../../lib/auth'
import { Loading } from '../utility'
import Router from 'next/router'

const Auth: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery('auth', fetchAuthUser)

  useEffect(() => {
    const unsubscribe = subscribeAuthState((adminUser) => {
      queryClient.setQueryData('auth', adminUser)
    })
    return () => unsubscribe()
  }, [queryClient])

  if (isLoading) return <Loading />

  if (data || Router.pathname === '/login') {
    return <>{children}</>
  }
  Router.push('/login')
  return <></>
}

export default Auth
