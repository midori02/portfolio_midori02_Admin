import React from 'react';
import {useQuery} from 'react-query'

import {SettingTemplate} from '../templates'
import {Loading} from '../utility'
import {fetchHistories} from '../../lib/histories'
import { admin } from '../../types/admin'

const SettingContainer = () => {
  const { data: user, isLoading: authLoading } = useQuery<admin>('auth')
  const adminId = user?.admin_id ?? ''
  const history = useQuery('histories', () => fetchHistories(adminId), {
    enabled: !!adminId,
  })

  if (authLoading || !user) return <Loading />
  if (history.isLoading) return <Loading />

  return <SettingTemplate admin={user} histories={history.data}/>
};

export default SettingContainer;
