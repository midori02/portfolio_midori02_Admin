import React from 'react';
import {useQueryClient} from 'react-query'

import {SettingTemplate} from '../templates'
import { admin } from "../../types/admin";

const SettingContainer = () => {
  const queryClient = useQueryClient()
  const user:admin = queryClient.getQueryData('auth')
  return <SettingTemplate admin={user}/>
};

export default SettingContainer;
