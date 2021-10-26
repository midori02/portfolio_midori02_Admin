import {NextPage} from 'next'

import {LoginContainer} from '../components/containers'
import {Auth} from '../components/utility'

const login:NextPage = () => {
  return (
    <Auth>
      <LoginContainer/>
    </Auth>)
};

export default login;
