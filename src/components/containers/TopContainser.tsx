import {FC} from 'react';
import {useQuery,useQueryClient} from 'react-query'

import {TopTemplate} from '../templates'
import {fetchContents} from '../../lib/contents'
import { admin } from "../../types/admin";

const TopContainer:FC = () => {
  const queryClient = useQueryClient()
  const user:admin = queryClient.getQueryData('auth')
  const userId = user.admin_id
  const contents = useQuery('contents', () =>fetchContents(userId) )
  return<TopTemplate contents={contents.data}/>
};

export default TopContainer;
