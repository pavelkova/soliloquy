import { db } from '../db'
import { encryptPassword,
         validatePassword } from 'services/auth-helpers/hashing'

const t = db('users')
const columns = [
  'id',
  'name',
  'email',
  'password',
  'created_at as createdAt',
  'updated_at as updatedAt',
  'settings'
]

const findById = async (id) => {
  console.log('ACTIONS -> USER -> FINDBYID ->')
  try {
    const userArr = await t.select(columns)
                           .where({ id })
    return userArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

const findByEmail = async (email) => {
  console.log('ACTIONS -> USER -> FINDBYEMAIL ->')

  try {
    const userArr = await t.select(columns)
                           .where({ email })
    return userArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/** Login user and create an object of their info to store in a JWT.
 * @param {String} email
 * @param {String} password
 *
 * @return {Object} User object
 */
const login = async (email, password) => {
  console.log('ACTIONS -> USER -> LOGIN ->')

  const user = await findByEmail(email)

  if (user) {
    const validPassword = await validatePassword(user, password)
    if (validPassword) {
      return user
    }
  }
  throw new Error('Invalid email or password.')
}

const signup = async (email, name, password) => {
  console.log('ACTIONS -> USER -> SIGNUP ->')

  const user = await findByEmail(email)

  if (user) {
    throw new Error('A user with that email already exists.')
  } else {

    const defaultSettings = {
      timezone: 'AUTO',
      wordCountGoal: 750,
      timeFormat: '12h',
      dayStartsAt: '00:00',
      textAnalysis: false,
      theme: 'default',
      fontName: '',
      fontSize: 14,
      backgroundColor: '',
      textColor: '',
      highlightColor: ''
    }

    try {
      const hash = await encryptPassword(password)
      const userArr = await t.returning(columns)
                             .insert({ email,
                                       name,
                                       password: hash,
                                       settings: JSON.stringify(defaultSettings)})
      return userArr[0]
    } catch(e) {
      console.error(e)
      throw new Error('Could not complete signup.')
    }
  }

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

const updateEmail = async (user, newEmail) => {
  // send confirmation email?
  return
}

const updateUserInfo = async (user, name) => {
  // maybe include email here without verification
  return
}

const updateSettings = async (user, settings) => {
  console.log('ACTIONS -> USER -> UPDATE SETTINGS ->')

  try {
    const userArr = await t.returning(columns)
                           .where({ id: user.id })
                           .update({ settings: JSON.stringify(settings) })
    return userArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

export { findById, findByEmail,
         login, signup, updatePassword, updateSettings }
