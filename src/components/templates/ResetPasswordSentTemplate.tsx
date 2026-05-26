import { VFC, useEffect } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useRouter } from 'next/router'

import AuthPageShell from '../Layouts/AuthPageShell'
import { PrimaryButton } from '../Buttons'
import { getAsString } from '../../lib/helper'

const ResetPasswordSentTemplate: VFC = () => {
  const router = useRouter()
  const email = router.query.email ? getAsString(router.query.email) : ''

  useEffect(() => {
    if (router.isReady && !email) {
      router.replace('/login/reset')
    }
  }, [router, email])

  if (!router.isReady) {
    return (
      <AuthPageShell title="送信完了">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </AuthPageShell>
    )
  }

  if (!email) {
    return null
  }

  return (
    <AuthPageShell title="送信完了">
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
      <Typography variant="body1" sx={{ width: '100%', mb: 2, textAlign: 'center' }}>
        パスワード再設定用のメールを送信しました。
      </Typography>
      <Typography variant="body2" sx={{ width: '100%', mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        <strong>{email}</strong> 宛にメールをお送りしました。メール内のリンクから新しいパスワードを設定してください。
      </Typography>
      <Typography variant="body2" sx={{ width: '100%', mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        メールが届かない場合は、迷惑メールフォルダをご確認ください。
      </Typography>
      <Box sx={{ width: '100%' }}>
        <PrimaryButton text="ログイン画面へ戻る" onClick={() => router.push('/login')} />
      </Box>
    </AuthPageShell>
  )
}

export default ResetPasswordSentTemplate
