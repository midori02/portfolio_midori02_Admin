import { VFC } from 'react'
import { Box, CircularProgress } from '@mui/material'

/** ページ本体の読み込み中に常にスピナーを表示する */
const PageSpinner: VFC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
      width: '100%',
    }}
  >
    <CircularProgress size={48} />
  </Box>
)

export default PageSpinner
