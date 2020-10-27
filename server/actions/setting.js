import { db } from '../db'

const t = db('settings')
const columns = ['id', 'user_id as userId', 'key', 'value']

const findByName = async (user, key) => {
  console.log('ACTIONS -> SETTING -> FINDBYNAME ->')
  try {
    const setting = await t.select(columns)
                           .where({ user_id: user.id, key }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return setting
}

const findAll = async (user) => {
  console.log('ACTIONS -> SETTING -> FINDALL')
  try {
    const setting = await t.select(columns)
                           .where({ user_id: user.id })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return setting
}

const create = async (user, key, value) => {
  console.log('ACTIONS -> SETTING -> CREATE ->')
  try {
    const setting = await t.returning(columns)
                           .insert({ user_id: user.id, key, value })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return setting
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

export { findByName, findAll, create, update }
