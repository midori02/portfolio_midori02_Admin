import { FC, ReactNode } from 'react'
import { Container, Box, Avatar, Typography, CssBaseline } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

type Props = {
  title: string
  children: ReactNode
}

const AuthPageShell: FC<Props> = ({ title, children }) => {
  return (
    <Container maxWidth="sm" component="main">
      <Box
        sx={{
          marginTop: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CssBaseline />
        <Avatar sx={{ backgroundColor: 'black', m: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ margin: '0 0 48px 0' }}>
          {title}
        </Typography>
        {children}
      </Box>
    </Container>
  )
}

export default AuthPageShell
