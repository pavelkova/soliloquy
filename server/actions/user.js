import { db } from '../db'
import { encryptPassword,
         validatePassword } from 'services/auth-helpers/hashing'

const t = db('users')
const columns = [
  'id',
  'email',
  'password',
  'created_at as createdAt',
  'updated_at as updatedAt',
]

const findById = async (id) => {
  console.log('ACTIONS -> USER -> FINDBYID ->')
  let user
  try {
    user = await t.select(columns)
                  .where({ id }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return user
}

const findByEmail = async (email) => {
  console.log('ACTIONS -> USER -> FINDBYEMAIL ->')
  let user
  try {
    user = await t.select(columns)
                  .where({ email }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return user
}

const login = async (email, password) => {
  console.log('ACTIONS -> USER -> LOGIN ->')
  const user = await findByEmail(email)
  if (user) {
    console.log(user)
    const validPassword = await validatePassword(user, password)
    console.log(validPassword)
    if (validPassword) return user
  }
  throw new Error('Invalid email or password.')
}
const signup = async (email, password) => {
  console.log('ACTIONS -> USER -> SIGNUP ->')
  let user = await findByEmail({ email })
  if (!user) {
    const hash = await encryptPassword(password)
    user = await t.returning(columns)
                  .insert({ email, password: hash })
    if (user) return user[0]
    throw new Error('Could not complete signup.')
  }
  throw new Error('A user with that email already exists.')
}

const updatePassword = async (user, oldPassword, newPassword) => {
  console.log('ACTIONS -> USER -> UPDATEPASSWORD ->')
  try {
    const match = await validatePassword(user, oldPassword)
    if (match) {
      const hash = await encryptPassword(newPassword)
      const userArr = await t.returning(columns)
                             .where({ id: user.id })
                             .update({ password: hash })
      return userArr[0]
    }
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

export { findById, findByEmail,
         login, signup, updatePassword }
