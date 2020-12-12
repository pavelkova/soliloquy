import { db } from '../db'
import { encryptPassword,
         validatePassword } from 'services/auth-helpers/hashing'
import { initialize as initializeDefaultSettings,
         findAll as findAllSettings } from './setting'


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
                  .where({ id }) // .first() // error -- cannot chain .first() on an insert query
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return user[0]
}

const findByEmail = async (email) => {
  console.log('ACTIONS -> USER -> FINDBYEMAIL ->')
  let user
  try {
    user = await t.select(columns)
                  .where({ email }) // .first() // error -- cannot chain .first() on an insert query
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return user[0]
}

/** Login user and create an object of their info to store in a JWT.
 * @param {String} email
 * @param {String} password
 *
 * @return {Object} User object with their settings attached
 */
const login = async (email, password) => {
  console.log('ACTIONS -> USER -> LOGIN ->')

  const user = await findByEmail(email)

  if (user) {
    const validPassword = await validatePassword(user, password)
    if (validPassword) {
      /* const settings = await findAllSettings(user)
       * user.settings = settings ?? {} */
      return user
    }
  }
  throw new Error('Invalid email or password.')
}

const signup = async (email, password) => {
  console.log('ACTIONS -> USER -> SIGNUP ->')
  let user = await findByEmail({ email })
  if (!user) {
    try {
      const hash = await encryptPassword(password)
      const userArr = await t.returning(columns)
                             .insert({ email, password: hash })
      user = userArr[0]
      await initializeDefaultSettings(user)
    } catch(e) {
      throw new Error('Could not complete signup.')
    }
    return user
  }
  throw new Error('A user with that email already exists.')
}

const updatePassword = async (user, oldPassword, newPassword) => {
  console.log('ACTIONS -> USER -> UPDATE PASSWORD ->')
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
