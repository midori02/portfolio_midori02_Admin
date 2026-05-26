import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

import { ResetPasswordSentTemplate } from '../templates'
import { useAuthQuery } from '../../lib/authQuery'

const ResetPasswordSentContainer: FC = () => {
  const router = useRouter()
  const { data: user } = useAuthQuery()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return <ResetPasswordSentTemplate />
}

export default ResetPasswordSentContainer
