import {FC} from 'react';
import {useQuery} from 'react-query'

import {TopTemplate} from '../templates'
import {fetchContents} from '../../lib/contents'

const TopContainer:FC = () => {

  const userId = 'mTLZenxmFraMwlT5FMjbfPpCCaf2'
  const contents = useQuery('contents', () =>fetchContents(userId) )
  return<TopTemplate contents={contents.data}/>
};

export default TopContainer;
