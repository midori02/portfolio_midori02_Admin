import React, { FC, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { subscribeAuthState } from '../../lib/auth'
import { AUTH_QUERY_KEY, useAuthQuery } from '../../lib/authQuery'
import { PageSpinner } from '../utility'

type Props = {
  children?: React.ReactNode
  /** 未認証でも表示するページ（/login 配下は自動で public） */
  publicRoute?: boolean
}

const Auth: FC<Props> = ({ children, publicRoute = false }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading, isFetched } = useAuthQuery()

  const isPublicRoute = publicRoute || router.pathname.startsWith('/login')

  useEffect(() => {
    const unsubscribe = subscribeAuthState((adminUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, adminUser)
    })
    return () => unsubscribe()
  }, [queryClient])

  useEffect(() => {
    if (isPublicRoute || !isFetched || data) return
    router.replace('/login')
  }, [isPublicRoute, isFetched, data, router])

  if (isPublicRoute) {
    return <>{children}</>
  }

  if (isLoading || !isFetched) {
    return <PageSpinner />
  }

  if (!data) {
    return null
  }

  return <>{children}</>
}

export default Auth
