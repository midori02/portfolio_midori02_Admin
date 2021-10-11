import {NextPage} from 'next'

import {BaseLayout} from '../components/Layouts'
import {TopContainer} from '../components/containers'


const Home:NextPage = () => {

  return (
    <BaseLayout pageContents={'All Contents'}>
      <TopContainer/>
    </BaseLayout>

  )
}

export default Home
