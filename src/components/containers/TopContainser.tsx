import {FC} from 'react';
import {useQuery} from 'react-query'

import {TopTemplate} from '../templates'
import {fetchContents} from '../../lib/contents'
import { Loading } from '../utility'
import { admin } from '../../types/admin'

const TopContainer:FC = () => {
  const { data: user, isLoading: authLoading } = useQuery<admin>('auth')
  const adminId = user?.admin_id ?? ''
  const contents = useQuery('contents', () => fetchContents(adminId), {
    enabled: !!adminId,
  })

  if (authLoading || !user) return <Loading />

  return <TopTemplate contents={contents.data}/>
};

export default TopContainer;
