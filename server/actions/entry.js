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

const findToday = async user => {
  const today = todayFieldsWithUserLocale(user)
  const todayEntry = await findByDate(user, today)
  if (todayEntry) return { todayEntry, today }
  return null
}

const findById = async (user, id) => {
  return await t.select(columns)
                .where({ user_id: user.id, id }).first()
}
// find all entries within
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

const create = async user => {
  let { todayEntry, today } = await findToday(user)

  if (!todayEntry) {
    try {
      const entryArr = await t.returning(columns)
                              .insert({ user_id: user.id,
                                        ...today })
      todayEntry = entryArr[0]
    } catch (e) {
      console.error(e)
      throw new Error('could not create entry for today')
    }
  }

  return todayEntry
}

const update = async (user, content, wordCount) => {
  let { todayEntry, today } = await findToday(user)

  if (!todayEntry) { throw new Error('no entry for today') }

  try {
    const entryArr = await t.returning(columns)
                            .where({ id: todayEntry.id })
                            .update({ content,
                                      word_count: wordCount,
                                      updated_at: new Date() })
    todayEntry = entryArr[0]
  } catch (e) {
    console.error(e)
    throw new Error('could not update today')
  }
  return todayEntry
}

export { findToday, findById, findByDate, findAll,
         create, update }
