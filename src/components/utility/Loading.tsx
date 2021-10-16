import {VFC} from 'react';
import {CircularProgress,Box} from '@mui/material'
import { useIsFetching, useIsMutating } from 'react-query'

const Loading:VFC = () => {
  const isLoading = useIsFetching()
  const isMutating = useIsMutating()
  if (isLoading || isMutating) {
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
