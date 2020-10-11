import { db } from 'db'
import { generateTokens, validateToken } from 'lib/auth'

export const userService = () => {
  const t = db('users')
  const columns = ['id', 'email', 'password', 'preferences']

  const findById = async id => {
    return await t
      .select(columns).where({ id }).first()
  }

  const findByEmail = async email => {
    return await t
      .select(columns).where({ email }).first()
  }

  const login = async (email, password) => {
    let user = await findByEmail(email)
    const token = generateTokens(user, 'thisahskfnalkfa')
    console.log(token)
    console.log(validateToken(token, 'thisahskfnalkfa'))
    if (user) {
      console.log('validate password')
      return user
    }
    throw new Error
  }

  const signup = async (email, password) => {
    let user = await findByEmail({ email })
    if (user) {
      throw new Error('email')
    }
    user = await t
      .returning(columns).insert({ email, password })
    return user[0]
  }

  return { findById, findByEmail, login, signup }
}
