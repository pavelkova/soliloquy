import { AuthForm } from 'components/AuthForm'
import { useMutation } from 'urql'

export default function Login() {
    return <AuthForm />
}

/* export const getServerSideProps = async ctx => {
 *   console.log(ctx.req)
 *   console.log(ctx.req.cookies)
 *   return { props: {} }
 * } */
