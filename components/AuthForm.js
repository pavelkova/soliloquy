import { useState } from 'react'
import { useMutation } from 'urql'

const LOGIN_MUTATION = `
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`

export const AuthForm = (props) => {
  let signup = (props.formName == 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [ result, login ] = useMutation(`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
  `)


  const handleSubmit = async e => {

    e.preventDefault()

      const { data, fetching, error } = await login({email, password })

      console.log(result)
      /* console.log(loginResult) */
      if (data?.login) {
        console.log(data.login)
      }
      console.log(fetching)
    }

  return (
    <div>
    <form onSubmit={ handleSubmit }>
    <input value={email} onChange={e =>
      setEmail(e.currentTarget.value)}/>
    <input value={password} onChange={e =>
      setPassword(e.currentTarget.value)}/>
    /* {signup ? <input type="password"></input> : ''} */
    <button type='submit'>Login</button>
    </form>
    </div>
  )
}
