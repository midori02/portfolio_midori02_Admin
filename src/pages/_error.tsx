import { NextPageContext } from 'next'
import NextError from 'next/error'

type Props = {
  statusCode: number
}

const ErrorPage = ({ statusCode }: Props) => {
  return <NextError statusCode={statusCode} />
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}

export default ErrorPage
