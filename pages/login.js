import { useMutation } from 'urql'
import { AuthForm } from 'components/AuthForm'
import LOGIN from 'mutations/Login.graphql'

export default function Login() {
  const [result, login] = useMutation(LOGIN)
  const formName = 'Login'

  return <AuthForm formName={ formName } mutation={ login } />
}

/* export const getServerSideProps = async ctx => {
 *   console.log(ctx.req)
 *   console.log(ctx.req.cookies)
 *   return { props: {} }
 * } */
