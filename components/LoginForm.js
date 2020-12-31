import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import LOGIN from 'mutations/Login.graphql'

export const LoginForm = ({ redirectOnSuccess }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange'
  })

  /* const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone */
  const [result, login] = useMutation(LOGIN)

  const onSubmit = async values => {
    if (errors) console.error(errors)

    const { data, fetching, error } = await login({ ...values })

    if (error) { console.error(error) }

    if (data?.login) console.log(typeof redirectOnSuccess)
    // setError
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input type="text" placeholder="Email" name="email" ref={
        register({required: true})} />
      </div>
      <div>
        <input type="password" placeholder="Password" name="password" ref={
        register({required: true})} />
      </div>

      <input type="submit" disabled={ !formState.isValid } />
    </form>
  )
}
