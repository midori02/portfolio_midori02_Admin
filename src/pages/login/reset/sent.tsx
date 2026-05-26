import { NextPage } from 'next'

import { ResetPasswordSentContainer } from '../../../components/containers'
import { Auth } from '../../../components/utility'

const ResetPasswordSentPage: NextPage = () => {
  return (
    <Auth publicRoute>
      <ResetPasswordSentContainer />
    </Auth>
  )
}

export default ResetPasswordSentPage
