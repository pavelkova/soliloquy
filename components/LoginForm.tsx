import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { Box, Button, Input, Label } from 'theme-ui'
import LOGIN from 'mutations/Login.graphql'

export const LoginForm = ({ redirectOnSuccess }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange'
  })

  const [result, login] = useMutation(LOGIN)

  const onSubmit = async values => {
    if (errors) console.error(errors)

    const { data, fetching, error } = await login({ ...values })

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
