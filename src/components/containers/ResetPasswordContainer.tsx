import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

import { ResetPasswordTemplate } from '../templates'
import { useAuthQuery } from '../../lib/authQuery'

const ResetPasswordContainer: FC = () => {
  const router = useRouter()
  const { data: user } = useAuthQuery()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return <ResetPasswordTemplate />
}

export default ResetPasswordContainer
