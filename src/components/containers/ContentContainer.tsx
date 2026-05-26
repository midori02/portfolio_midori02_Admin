import {FC} from 'react';
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'

import {ContentTemplate} from '../templates'
import {getAsString} from '../../lib/helper'
import {fetchContent} from "../../lib/contents";
import { Loading } from '../utility'
import { admin } from '../../types/admin'

const ContentContainer:FC = () => {
  const router = useRouter()
  const id = router.query.contentId
  const { data: user, isLoading: authLoading } = useQuery<admin>('auth')
  const adminId = user?.admin_id ?? ''

  const content = useQuery(
    ['content', getAsString(id)],
    () => fetchContent(adminId, getAsString(id)),
    {
      enabled: !!id && !!adminId,
      staleTime: 0,
    }
  )

  if (authLoading || !user) return <Loading />

  return <ContentTemplate content={content.data} uid={adminId}/>
};

export default ContentContainer;
