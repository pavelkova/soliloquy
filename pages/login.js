import { AuthForm } from 'components/AuthForm'

export default function Login() {
  return <AuthForm />
}

/* export const getServerSideProps = async ctx => {
 *   console.log(ctx.req)
 *   console.log(ctx.req.cookies)
 *   return { props: {} }
 * } */
