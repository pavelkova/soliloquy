import { AuthForm } from 'components/AuthForm'
import { useMutation } from 'urql'

export default function Login() {
    return <AuthForm formName='login' />
}
