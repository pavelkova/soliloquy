import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { LoginForm } from 'components/LoginForm'
export { getServerSideProps } from 'lib/ssr/require-no-auth'

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
