import { useQuery } from 'react-query'
import { fetchAuthUser } from './auth'
import { admin } from '../types/admin'

export const AUTH_QUERY_KEY = 'auth'

export const useAuthQuery = () =>
  useQuery<admin>(AUTH_QUERY_KEY, fetchAuthUser, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })
