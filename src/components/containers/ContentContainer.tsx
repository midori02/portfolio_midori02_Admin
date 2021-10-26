import {FC} from 'react';
import {useRouter} from 'next/router'
import {useQuery,useQueryClient} from 'react-query'

import {ContentTemplate} from '../templates'
import {getAsString} from '../../lib/helper'
import {fetchContent} from "../../lib/contents";
import { admin } from "../../types/admin";

const ContentContainer:FC = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const id = router.query.contentId
  const user:admin = queryClient.getQueryData('auth')
  const uid = user.admin_id
  const content = useQuery(
    ['content',getAsString(id)],
    () => fetchContent(uid,getAsString(id)), {
      enabled: !!id,
      staleTime:0
    }
  )

  return <ContentTemplate content={content.data} uid={uid}/>
};

export default ContentContainer;
