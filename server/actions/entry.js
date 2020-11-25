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

/**
 * Determine today's date for the logged-in user's preferred timezone
 * and return an entry matching its yyyy-mm-dd, if one exists.
 *
 * @param user Object from GraphQL context with user id, email, and browser timezone
 */
// TODO add optional user timezone setting
const findToday = async user => {
  console.log('ACTIONS -> FIND TODAY ->')
  let todayEntry
  // FIXME date function
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

/**
 * Return an array of user's entries for a specified date or date range
 *
 * @param yyyy Integer, required.
 * @param mm Integer in range 1-12 to match a calendar month. If not provided,
 * all entries for the year will be returned.
 * @param dd Integer in range 1-31 to match a date within the calendar month. If not provided,
 * all entries for the month will be returned.
 */
const findByDate = async (user, date) => {
  console.log('ACTIONS -> FIND ENTRY BY DATE ->')
  if (!date.yyyy) throw new Error('no date provided')
  // remove null mm & dd to return all entries for a year
  if (!date.mm) delete date.mm
  // remove null dd to return all entries for a month
  if (!date.dd) delete date.dd

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

/**
 * Find all entries for the authorized user.
 *
 * @param user User object passed from GraphQL context.
 */
const findAll = async user => {
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

/**
 * Initialize today's entry for the authorized user if it does not exist.
 *
 * @param user User object passed from GraphQL context.
 */
const create = async user => {
  console.log('ACTIONS -> CREATE ENTRY ->')

  let { today, todayEntry } = await findToday(user)

  // [TODO] add locale-formatted datetimes
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

/*
 * Update today's entry for authorized user and pass activity-related params
 * to create or update the appropriate activity log.
 *
 * @param user
 * @param id
 * @param content
 * @param wordCount
 * @param lowestWordCount
 * @param start
 */
const update = async (user, id, content, wordCount, { lowestWordCount, start }) => {
  if (!content) return
  console.log('ACTIONS -> UPDATE ENTRY->')

  let updatedEntry
  console.log(content, wordCount, lowestWordCount, start)

  try {
    await createOrUpdateActivityLog(id, content, wordCount, lowestWordCount, start)

    const entryArr = await t.returning(columns)
                            .where({ id })
                            .update({ content,
                                      word_count: wordCount,
                                      // FIXME date function
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
