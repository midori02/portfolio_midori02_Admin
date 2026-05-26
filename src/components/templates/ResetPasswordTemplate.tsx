import { VFC, useState, useCallback } from 'react'
import { Box, Typography, Alert } from '@mui/material'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'

import AuthPageShell from '../Layouts/AuthPageShell'
import { TextInput } from '../Inputs'
import { PrimaryButton } from '../Buttons'
import { useStringChangeEvent } from '../../lib/customHooks'
import { sendPasswordReset } from '../../lib/auth'

const ResetPasswordTemplate: VFC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const onEmailChange = useStringChangeEvent(setEmail)

  const resetMutate = useMutation(sendPasswordReset, {
    onSuccess: (_data, submittedEmail) => {
      router.push({
        pathname: '/login/reset/sent',
        query: { email: submittedEmail },
      })
    },
    onError: (error: unknown) => {
      const text =
        error instanceof Error ? error.message : '再設定メールの送信に失敗しました。'
      setErrorMessage(text)
    },
  })

  const handleSubmit = useCallback(() => {
    setErrorMessage(null)
    resetMutate.mutate(email.trim())
  }, [email, resetMutate])

  return (
    <AuthPageShell title="パスワード再設定">
      <Typography variant="body1" sx={{ width: '100%', mb: 3, textAlign: 'center' }}>
        登録済みのメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
      </Typography>
      <Box sx={{ width: '100%', marginBottom: '48px' }}>
        <TextInput
          placeholder="sample@sample.com"
          label="Email"
          onChange={onEmailChange}
          value={email}
        />
      </Box>
      <PrimaryButton
        text={resetMutate.isLoading ? '送信中…' : '再設定メールを送る'}
        disabled={resetMutate.isLoading}
        onClick={handleSubmit}
      />
      <Box sx={{ width: '100%', marginTop: 2 }}>
        <PrimaryButton
          text="ログイン画面へ戻る"
          variant="text"
          color="inherit"
          disabled={resetMutate.isLoading}
          onClick={() => router.push('/login')}
        />
      </Box>
      {errorMessage && (
        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </AuthPageShell>
  )
}

export default ResetPasswordTemplate
