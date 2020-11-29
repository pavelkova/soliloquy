import { useMutation } from 'urql'
import { AuthForm } from 'components/AuthForm'
import SIGNUP from 'mutations/Signup.graphql'

export default function Signup() {
  const [result, signup] = useMutation(SIGNUP)
  const formName = 'Signup'

  return <AuthForm formName={ formName } mutation={ signup } />
}
/* export const getServerSideProps = async ctx => {
 *   console.log('SIGNUP PAGE -> GET SSR PROPS ->')
 *   const { data, error } = await ssrQuery(ctx, CURRENT_USER)
 *   return { props: { today: todayEntry, error } }
 * } */
