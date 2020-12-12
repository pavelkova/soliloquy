import { db } from '../db'

const t = db('settings')
const columns = ['id', 'user_id as userId', 'key', 'value']

const findByName = async (user, key) => {
  console.log('ACTIONS -> SETTING -> FINDBYNAME ->')
  let setting
  try {
    setting = await t.select(columns)
                     .where({ user_id: user.id, key }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return setting
}

const findAll = async (user) => {
  console.log('ACTIONS -> SETTING -> FINDALL')
  let settings
  try {
    settings = await t.select(columns)
                      .where({ user_id: user.id })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return settings
}

/* const create = async (user, key, value) => {
 *   console.log('ACTIONS -> SETTING -> CREATE ->')
 *   let setting
 *   try {
 *     setting = await t.returning(columns)
 *                      .insert({ user_id: user.id, key, value })
 *   } catch (e) {
 *     console.error(e.message)
 *     throw new Error(e)
 *   }
 *   return setting
 * } */

/** Generate settings with default values for a given user,
 * to be called during user creation.
 *
 * @param user
*/
const initialize = async user => {
  const defaultSettings = [
    { key: 'timezone', value: 'auto'}, // String
    { key: 'wordCountGoal', value: '750' }, // Integer
    { key: 'timeFormat', value: '12h' }, // String
    { key: 'dayStartsAt', value: '00:00' }, // String
    { key: 'textAnalysis', value: 'disabled' }, // Boolean
    { key: 'theme', value: 'default' }, // String
    { key: 'fontName', value: '' }, // String
    { key: 'fontSize', value: '' }, // Integer
    { key: 'backgroundColor', value: '' }, // String
    { key: 'textColor', value: '' }, // String
    { key: 'highlightColor', value: '' }, // String
  ]
  defaultSettings.forEach(setting => { setting.user_id = user.id })

  let createdSettings

  try {
    createdSettings = await t.returning(columns)
                           .insert(defaultSettings)
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return createdSettings
}

const update = async (user, id, key, value) => {
  console.log('ACTIONS -> SETTING -> UPDATE ->')
  try {
    const setting = await t.returning(columns)
                           .where({ user_id: user.id, id })
                           .update({ key, value })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return setting
}

export { findByName, findAll, initialize, update }
