import { db } from '../db'

const t = db('settings')
const columns = ['id',
                 'user_id as userId',
                 'key',
                 'value']

const findByName = async (user, key) => {
  return await t.select(columns)
                .where({ user_id: user.id, key }).first()
}

const findAll = async (user) => {
  return await t.select(columns)
                .where({ user_id: user.id })
}

const create = async (user, key, value) => {
  return await t.returning(columns)
                .insert({ user_id: user.id, key, value })
}

const update = async (user, id, key, value) => {
  return await t.returning(columns)
                .where({ user_id: user.id, id })
                .update({ key, value })
}

export { findByName, findAll,
         create, update }
