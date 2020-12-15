import { useRouter } from 'next/router'
import { ssrRequireNoAuth } from 'lib/auth-check'
import { LoginForm } from 'components/LoginForm'

export default function Login() {
  const router = useRouter()

  function  redirectOnSuccess() {
    router.push('/today')
  }

  return (
    <LoginForm props={ redirectOnSuccess } />
  )
}

export const getServerSideProps = async ctx => {
  const props = {}
  const { user } = await ssrRequireNoAuth(ctx)

  if (user) props.user = user

  return { props }
}
