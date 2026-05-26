import {FC} from 'react';
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import { Alert } from '@mui/material'

import {ContentTemplate} from '../templates'
import {getAsString} from '../../lib/helper'
import {fetchContent} from "../../lib/contents";
import { PageSpinner } from '../utility'
import { useAuthQuery } from '../../lib/authQuery'

const ContentContainer:FC = () => {
  const router = useRouter()
  const id = router.query.contentId
  const { data: user, isLoading: authLoading, isFetched: authFetched } = useAuthQuery()
  const adminId = user?.admin_id ?? ''

  const content = useQuery(
    ['content', getAsString(id)],
    () => fetchContent(adminId, getAsString(id)),
    {
      enabled: !!id && !!adminId,
      staleTime: 0,
    }
  )

  if (!authFetched || authLoading) return <PageSpinner />
  if (!user) return null

  if (id && (content.isLoading || content.isFetching)) return <PageSpinner />
  if (content.isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        コンテンツの読み込みに失敗しました。ページを再読み込みしてください。
      </Alert>
    )
  }

  return <ContentTemplate content={content.data} uid={adminId}/>
};

export default ContentContainer;
