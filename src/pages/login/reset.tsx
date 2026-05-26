import { NextPage } from 'next'

import { ResetPasswordContainer } from '../../components/containers'
import { Auth } from '../../components/utility'

const ResetPasswordPage: NextPage = () => {
  return (
    <Auth publicRoute>
      <ResetPasswordContainer />
    </Auth>
  )
}

export default ResetPasswordPage
