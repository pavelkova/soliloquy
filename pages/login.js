import { useMutation } from 'urql'
import { ssrAuthCheck } from 'lib/auth-check'
import { AuthForm } from 'components/AuthForm'
import LOGIN from 'mutations/Login.graphql'

export default function Login() {
  const [result, login] = useMutation(LOGIN)
  const formName = 'Login'

  return <AuthForm formName={ formName } mutation={ login } />
}

export const getServerSideProps = async ctx => {
  const props = {}
  const { user } = await ssrAuthCheck(ctx, '/today', false)

  if (user) props.user = user

  return { props }
}
