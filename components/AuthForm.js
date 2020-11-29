import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const isValid = {
  email: {
    check: (em) => {
      return em.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    },
    description: 'Enter a valid email address.',
    errorMessage: 'Not a valid email address.'
  },
  password: {
    check: (pw) => {
      return pw.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    },
    description: 'Password must be 8 or more characters in length, and must contain at least one uppercase letter, one lowercase letter, and one numerical digit.',
    errorMessage: 'Password fails to meet one or more of the criteria.'
  }
}

export const AuthForm = ({formName, mutation}) => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data, fetching, error } = await mutation({ email,
                                                    password,
                                                    browserTimezone })
    if (error) console.error(error)

    if (data && (data.login || data.signup)) router.push('/today')
    // disable submit on invalid or loading
  }

  /* const validator = {
   * thing: {
   *   check: (instance) => { return Boolean(instance.match()) },
   *   text: '',
   *   errorMessage: ''
   *   }
   * } */

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)} />
          </label>
          <span hidden={ formName !== 'Signup' }>{ isValid.email.description }</span>
        </div>
        <div>
          <label>Password:
            <input
              id="password"
              name="password"
              value={password}
              type={ passwordVisible ? `text` : `password` }
              onChange={(e) => setPassword(e.currentTarget.value)} />
          </label>
          <span hidden={ formName !== 'Signup' }>{ isValid.password.description }</span>
        </div>
        <div>
          <button type="submit" disabled={!isValid.password.check(password) || !isValid.email.check(email)}>
            { formName }
          </button>
        </div>
      </form>
    </div>
  )
}
