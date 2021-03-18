import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { Box, Button, Label, Input, Select } from 'theme-ui'
import SIGNUP from 'mutations/Signup.graphql'

export const SignupForm = () => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur'
  })
  /* const onSubmit = data => console.log(data) */

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [result, signup] = useMutation(SIGNUP)

  const onSubmit = async values => {
    console.log(values)
    if (errors) console.error(errors)

    const { data, fetching, error } = await signup({ ...values, browserTimezone })

    if (error) { console.error(error) }

    if (data?.signup) router.push('/today')
    // setError
  }

  return (
    <Box as='form' onSubmit={ handleSubmit(onSubmit) }>
      <Label htmlFor='name'>Name</Label>
      <Input name='name' ref={
      register({ required: true,
                 maxLength: {
                   value: 80,
                   message: 'Name cannot be more than 80 characters long.' }})} />
      <Label htmlFor='email'>Email</Label>
      <Input name='email' type='email' ref={
      register({ required: true,
                 pattern: /^\S+@\S+$/i})} />
      <Label htmlFor='password'>Password</Label>
      <Input name='password' type='password' ref={ register({required: true}) } />
      <Label htmlFor='timezone'>Timezone</Label>
      <Select name='timezone' ref={register}>
        <option value='AUTO'>Autodetect</option>
      </Select>
      <Button type='submit' disabled={ !formState.isValid }>Submit</Button>
    </Box>
  )
}

/* <form onSubmit={handleSubmit(onSubmit)}>
 *   <div>
 *     <input type="text" placeholder="Name" name="name" ref={
 *     register({ required: 'This field is required.',
 *                maxLength: {
 *                  value: 80,
 *                  message: 'Name cannot be more than 80 characters long.'
 *     }})} />
 *     <span> ERROR: { errors.name?.message }</span>
 *   </div>
 *   <div>
 *     <input type="text" placeholder="Email" name="email" ref={
 *     register({required: true, pattern: /^\S+@\S+$/i})} />
 *   </div>
 *   <div>
 *     <input type="password" placeholder="Password" name="password" ref={
 *     register({required: true})} />
 *   </div>

 *   <div>
 *     <label>
 *       <h3>Timezone</h3>
 *       <select name='timezone' ref={
 *         register}>
   <option value='AUTO'>Autodetect</option>
   </select>
   </label>
   </div>
   <input type="submit" disabled={ !formState.isValid } />
   </form> */
