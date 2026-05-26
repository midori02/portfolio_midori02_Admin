import {FC} from 'react';
import {useQuery} from 'react-query'
import { Alert } from '@mui/material'

import {TopTemplate} from '../templates'
import {fetchContents} from '../../lib/contents'
import { PageSpinner } from '../utility'
import { useAuthQuery } from '../../lib/authQuery'

const TopContainer:FC = () => {
  const { data: user, isLoading: authLoading, isFetched: authFetched } = useAuthQuery()
  const adminId = user?.admin_id ?? ''
  const contents = useQuery('contents', () => fetchContents(adminId), {
    enabled: !!adminId,
  })

  if (!authFetched || authLoading) return <PageSpinner />
  if (!user) return null

  if (contents.isLoading || contents.isFetching) return <PageSpinner />
  if (contents.isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        コンテンツの読み込みに失敗しました。ページを再読み込みしてください。
      </Alert>
    )
  }

  return <TopTemplate contents={contents.data ?? []}/>
};

export default TopContainer;
