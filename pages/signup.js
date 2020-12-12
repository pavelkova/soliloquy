import { useMutation } from 'urql'
import { ssrAuthCheck } from 'lib/auth-check'
import { AuthForm } from 'components/AuthForm'
import SIGNUP from 'mutations/Signup.graphql'

export default function Signup() {
  const [result, signup] = useMutation(SIGNUP)
  const formName = 'Signup'

  return <AuthForm formName={ formName } mutation={ signup } />
}

export const getServerSideProps = async ctx => {
  const { user } = await ssrAuthCheck(ctx, '/today', false)

  return { props: { user } }
}
