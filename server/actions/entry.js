import { db } from '../db'
import { todayFieldsWithUserLocale } from 'utils/date'
import { createOrUpdate as createOrUpdateActivityLog } from './activity-log'

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
  console.log('ACTIONS -> FIND ENTRY BY ID ->')
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
  console.log('ACTIONS -> FIND ENTRY BY DATE ->')
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
    console.log('ERROR IN findByDate')
    console.error(e.message)
    throw new Error(e)
  }
  return entries
}

const findAll = async (user) => {
  console.log('ACTIONS -> FIND ALL ENTRIES ->')
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
  console.log('ACTIONS -> CREATE ENTRY ->')

  let { today, todayEntry } = await findToday(user)

  if (!todayEntry) {
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

  return todayEntry
}

const update = async (_user, id, content, wordCount, startTime) => {
  if (!content) return
  console.log('ACTIONS -> UPDATE ENTRY->')

  let updatedEntry

  try {
    await createOrUpdateActivityLog(id, content, startTime)

    const entryArr = await t.returning(columns)
                            .where({ id })
                            .update({ content,
                                      word_count: wordCount,
                                      updated_at: new Date() })
    updatedEntry = entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return updatedEntry
}

export { findToday, findById, findByDate, findAll,
         create, update }
