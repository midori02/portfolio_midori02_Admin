import {NextPage} from 'next'

import {LoginContainer} from '../../components/containers'
import {Auth} from '../../components/utility'

const LoginPage: NextPage = () => {
  return (
    <Auth publicRoute>
      <LoginContainer/>
    </Auth>
  )
}

export default LoginPage
