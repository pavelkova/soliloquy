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
  return await t.select(columns)
                .where({ id }).first()
}

const findByEmail = async (email) => {
  return await t.select(columns)
                .where({ email }).first()
}

const login = async (email, password) => {
  const user = await findByEmail(email)
  if (user) {
    const validPassword = await validatePassword(user, password)
    if (validPassword) return user
  }
  throw new Error('email or password is wrong')
}

const signup = async (email, password) => {
  let user = await findByEmail({ email })

  if (!user) {
    const hash = await encryptPassword(password)
    user = await t.returning(columns)
                  .insert({ email, password: hash })
    return user[0]
  }
  throw new Error('email')
}

const updatePassword = async (user, oldPassword, newPassword) => {
  const match = await validatePassword(user, oldPassword)
  if (match) {
    const hash = await encryptPassword(newPassword)
    const userArr = await t.returning(columns)
                           .where({ id: user.id })
                           .update({ password: hash })
    return userArr[0]
  }
  throw new Error('old password doesnt match')
}

export { findById, findByEmail,
         login, signup, updatePassword }
