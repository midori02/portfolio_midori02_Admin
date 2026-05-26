import {VFC} from 'react';
import {CircularProgress,Box} from '@mui/material'
import { useIsFetching } from 'react-query'

const PAGE_DATA_KEYS = new Set(['contents', 'histories', 'content'])

const Loading:VFC = () => {
  // auth / 各ページのデータ取得は PageSpinner で表示（二重オーバーレイ・取り残しを防ぐ）
  const isLoading = useIsFetching({
    predicate: (query) => {
      const key = query.queryKey[0]
      if (key === 'auth') return false
      if (typeof key === 'string' && PAGE_DATA_KEYS.has(key)) return false
      return true
    },
  })
  if (isLoading) {
    return (
      <Box sx={{
        backgroundColor:'rgba(0, 0, 0, 0.3)',
        padding:'calc(100vh / 2 - 36px) 0',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        textAlign: 'center',
        zIndex: 99999}}>
        <CircularProgress size={60} color={'inherit'} />
      </Box>
    )
  } else {
    return <></>
  }

};

export default Loading;
