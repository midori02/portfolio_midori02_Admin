import {FC} from 'react';
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'

import {ContentTemplate} from '../templates'
import {getAsString} from '../../lib/helper'
import {fetchContent} from "../../lib/contents";

const ContentContainer:FC = () => {
  const router = useRouter()
  const id = router.query.contentId
  const uid = 'mTLZenxmFraMwlT5FMjbfPpCCaf2'//login機能実装時に変更

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
