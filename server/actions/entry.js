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
  console.log('ACTIONS -> FIND TODAY ->')
  let todayEntry
  const today = todayFieldsWithUserLocale(user)
  try {
    const entries = await findByDate(user, today)
    todayEntry = entries[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return { today, todayEntry }
}

const findById = async (user, id) => {
  let entry
  try {
    entry = await t.select(columns)
                   .where({ user_id: user.id, id }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return entry
}
// find all entries within
const findByDate = async (user, date) => {
  if (!date.yyyy) throw new Error('no date provided')
  // remove null mm & dd to return all entries for a year
  date.mm ? null : delete date.mm
  // remove null dd to return all entries for a month
  date.dd ? null : delete date.dd

  let entries

  try {
    entries = await t.select(columns)
                     .where({ user_id: user.id,
                              ...date })

  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return entries
}

const findAll = async (user) => {
  let entries
  try {
    entries = await t.select(columns)
                     .where({ user_id: user.id })
  } catch (e) {
    console.error(e.message)
  }
  return entries
}

const create = async user => {
  console.log('ACTIONS -> CREATE ->')

  let { today, todayEntry } = await findToday(user)
  if (!todayEntry) {
    console.log('NOO TODAY')
    try {
      const entryArr = await t.returning(columns)
                              .insert({ user_id: user.id,
                                        ...today })
      todayEntry = entryArr[0]
    } catch (e) {
      console.error(e.message)
      throw new Error(e)
    }
  }
  console.log('TODAY ENTRY')
  console.log(todayEntry)

  return todayEntry
}

const update = async (user, id, content, wordCount) => {
  let entry
  try {
    const entryArr = await t.returning(columns)
                            .where({ id })
                            .update({ content,
                                      word_count: wordCount,
                                      updated_at: new Date() })
    entry = entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return entry
}

export { findToday, findById, findByDate, findAll,
         create, update }
