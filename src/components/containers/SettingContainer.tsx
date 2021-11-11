import React from 'react';
import {useQuery,useQueryClient} from 'react-query'

import {SettingTemplate} from '../templates'
import {Loading} from '../utility'
import {fetchHistories} from '../../lib/histories'
import { admin } from "../../types/admin";

const SettingContainer = () => {
  const queryClient = useQueryClient()
  const user:admin = queryClient.getQueryData('auth')
  const history = useQuery('histories',() =>fetchHistories(user.admin_id))

  if(history.isLoading) return <Loading/>
  return <SettingTemplate admin={user} histories={history.data}/>
};

export default SettingContainer;
