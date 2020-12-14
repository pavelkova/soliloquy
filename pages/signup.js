import { ssrAuthCheck } from 'lib/auth-check'
import { SignupForm } from 'components/SignupForm'

export default function Signup() {

  return (
    <SignupForm />
  )
}

export const getServerSideProps = async ctx => {
  console.log('GET SSR -> SIGNUP')
  const props = {}
  const { user } = await ssrAuthCheck(ctx, '/today', false)

  if (user) props.user = user

  return { props }
}
