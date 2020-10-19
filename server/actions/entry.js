import { db } from '../db'
import { todayFieldsWithUserLocale } from 'utils/date'

const t = db('entries')
const columns = [
  'id',
  'user_id as userId',
  'content',
  'yyyy',
  'mm',
  'dd',
  'word_count as wordCount',
  'created_at as createdAt',
  'updated_at as updatedAt'
]

const findById = async (user, id) => {
  return await t.select(columns)
                .where({ user_id: user.id, id }).first()
}

const findByDate = async (user, date) => {
  if (!date.yyyy) throw new Error('no date provided')
  date.mm ? null : delete date.mm
  date.dd ? null : delete date.dd

  try {
    const entryArr = await t.select(columns)
                            .where({ user_id: user.id,
                                     ...date })
    if (entryArr.length > 1) return entryArr
    return entryArr[0]

  } catch (e) {
    console.error(e.message)
  }
}

const findAll = async (user) => {
  try {
    return await t.select(columns)
                  .where({ user_id: user.id })
  } catch (e) {
    console.error(e.message)
  }
}

const findToday = async user => {
  const today = todayFieldsWithUserLocale(user)
  const todayEntry = await findByDate(user, today)
  if (todayEntry) return todayEntry
  return null
}
const create = async (user, content, wordCount) => {
  const today = todayFieldsWithUserLocale(user)
  let todayEntry = await findByDate(user, today)

  if (todayEntry) return todayEntry

  const entryArr = await t.returning(columns)
                          .insert({ user_id: user.id,
                                    ...today })
  return entryArr[0]
}

const update = async (user, content, wordCount) => {
  const today = todayFieldsWithUserLocale(user)
  let todayEntry = await findByDate(user, today)

  if (!todayEntry) return create(user)

  const entryArr = await t.returning(columns)
                .where({ user_id: user.id,
                         ...today })
                .update({ content,
                          word_count: wordCount })
  return entryArr[0]
  // check if updated_at was more than five minutes ago; if so, get most recent activity log; if it has content, create new activity log; if not,
  // add updated content
  // check if activity log exists with end_time less than five minutes ago
  // if so, update existing activity log with current time
  // else add new activity log
}

export { findToday, findById, findByDate, findAll,
         create, update }
