import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import SIGNUP from 'mutations/Signup.graphql'

export const SignupForm = () => {
  const { register, handleSubmit, errors, setError } = useForm()
  /* const onSubmit = data => console.log(data) */

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [result, signup] = useMutation(SIGNUP)

  const onSubmit = async values => {
    if (errors) console.error(errors)

    const { data, fetching, error } = await signup({ ...values, browserTimezone })

    if (error) {}

    if (data?.signup) router.push('/today')
    // setError
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input type="text" placeholder="Name" name="name" ref={
        register({required: true, maxLength: 80})} />
      </div>
      <div>
        <input type="text" placeholder="Email" name="email" ref={
        register({required: true, pattern: /^\S+@\S+$/i})} />
      </div>
      <div>
        <input type="password" placeholder="Password" name="password" ref={
        register({required: true})} />
      </div>

      <input type="submit" />
    </form>
  )
}
