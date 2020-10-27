import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'urql'
import LOGIN from 'mutations/Login.graphql'


export const AuthForm = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [result, login] = useMutation(LOGIN)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, fetching, error } = await login({ email,
                                                    password })
    if (error) console.error(error)
    if (data?.login) router.push('/today')
    // disable submit on invalid or loading
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
