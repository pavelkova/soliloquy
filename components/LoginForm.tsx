import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { Box, Button, Input, Label } from 'theme-ui'
import LOGIN from 'mutations/Login.graphql'

export const LoginForm = ({ redirectOnSuccess }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange'
  })

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [result, login] = useMutation(LOGIN)

  const onSubmit = async values => {
    if (errors) console.error(errors)
    console.log(values)

    const { data, fetching, error } = await login({ ...values, browserTimezone })

    if (error) { console.error(error) }

    if (fetching) console.log(fetching)
    if (data) console.log(data)
    if (data?.login) redirectOnSuccess()
    // setError
  }
  return (
    <Box as='form' onSubmit={ handleSubmit(onSubmit) }>
      <Label htmlFor='email'>Email</Label>
      <Input name='email' type='email' ref={register({required: true})} />
      <Label htmlFor='password'>Password</Label>
      <Input name='password' type='password' ref={register({required: true})} />
      <Button type='submit'>Submit</Button>
    </Box>
  )
}

/* <form onSubmit={handleSubmit(onSubmit)}>
 *   <div>
 *     <input type="text" placeholder="Email" name="email" ref={
 *     register({required: true})} />
 *   </div>
 *   <div>
 *     <input type="password" placeholder="Password" name="password" ref={
 *       register({required: true})} />
   </div>

   <input type="submit" disabled={ !formState.isValid } />
   </form> */
