import { ssrRequireNoAuth } from 'lib/auth-check'
import { SignupForm } from 'components/SignupForm'
import { useRouter } from 'react'

export default function Signup() {
  const router = useRouter()
  // redirect to welcome page
  return (
    <SignupForm />
  )
}

export const getServerSideProps = async ctx => {
  console.log('GET SSR -> SIGNUP')
  const props = {}
  const { user } = await ssrRequireNoAuth(ctx)

  if (user) props.user = user

  return { props }
}
