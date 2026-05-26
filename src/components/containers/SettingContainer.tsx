import React from 'react';
import {useQuery} from 'react-query'
import { Alert } from '@mui/material'

import {SettingTemplate} from '../templates'
import {PageSpinner} from '../utility'
import {fetchHistories} from '../../lib/histories'
import { useAuthQuery } from '../../lib/authQuery'

const SettingContainer = () => {
  const { data: user, isLoading: authLoading, isFetched: authFetched } = useAuthQuery()
  const adminId = user?.admin_id ?? ''
  const history = useQuery('histories', () => fetchHistories(adminId), {
    enabled: !!adminId,
  })

  if (!authFetched || authLoading) return <PageSpinner />
  if (!user) return null

  if (history.isLoading || history.isFetching) return <PageSpinner />
  if (history.isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        履歴の読み込みに失敗しました。ページを再読み込みしてください。
      </Alert>
    )
  }

  return <SettingTemplate admin={user} histories={history.data ?? []}/>
};

export default SettingContainer;
