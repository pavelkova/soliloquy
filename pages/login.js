import { useRouter } from 'next/router'
import { ssrRequireNoAuth } from 'lib/ssr-auth'
import { LoginForm } from 'components/LoginForm'

export default function Login() {
  const router = useRouter()

  const props = {
    redirectOnSuccess: (() => {
      router.push('/today')
    })
  }

  return (
    <LoginForm { ...props } />
  )
}

export const getServerSideProps = async ctx => {
  const props = {}
  const { user } = await ssrRequireNoAuth(ctx)

  if (user) props.user = user

  return { props }
}
