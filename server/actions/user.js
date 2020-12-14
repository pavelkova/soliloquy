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

const signup = async (email, name, password) => {
  console.log('ACTIONS -> USER -> SIGNUP ->')
  let user = await findByEmail(email)

  console.log(user)

  if (!user) {
    console.log('NO USER')

    const defaultSettings = {
      timezone: 'auto',
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
      console.log(userArr)
      user = userArr[0]
    } catch(e) {
      console.error(e)
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
  console.log(settings)
  return
}

export { findById, findByEmail,
         login, signup, updatePassword, updateSettings }
