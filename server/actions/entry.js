import { db } from '../db'
import { now, formatEntryDate } from 'utils/date'
import { createOrUpdate as createOrUpdateActivityLog } from './activity-log'

const t = db('entries')
const columns = [
  'id',
  'user_id as userId',
  'date',
  'timezone',
  'content',
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
const findToday = async (user, timezone) => {
  console.log('ACTIONS -> FIND TODAY ->')
  const today = formatEntryDate(timezone)

  let todayEntry

  try {
    todayEntry = await findByDate(user, today)
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return todayEntry
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
 * Return a single entry for the authorized user that matches the given date
 *
 * @param date String representing the date in format "yyyy-mm-dd"
 */
const findByDate = async (user, date) => {
  console.log('ACTIONS -> FIND ENTRY BY DATE ->')

  let entry

  try {
    const entries = await t.select(columns)
                           .where({ user_id: user.id, date })
    entry = entries[0]

  } catch (e) {
    console.log('ERROR IN findByDate')
    console.error(e.message)
    throw new Error(e)
  }
  return entry
}

/**
 * Return an array of user's entries between two given dates
 *
 * @param fromDate String representing the start date in format "yyyy-mm-dd"
 * @param toDate String representing the end date in format "yyyy-mm-dd"
 */
const findByDateSpan = async(user, fromDate, toDate) => {
  console.log('ACTIONS -> FIND ENTRIES BY DATES ->')

  let entries

  try {
    entries = await t.select(columns)
                     .where({ user_id: user.id})
                     .whereBetween('date', [fromDate, toDate])
  } catch(e) {
    console.log('ERROR IN findByDateSpan')
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
const create = async (user, timezone) => {
  console.log('ACTIONS -> CREATE ENTRY ->')

  // [HACK] choose between
  const today = formatEntryDate(timezone)
  let todayEntry= await findToday(user, timezone)

  // use same timestamp for created_at and initial updated_at
  const saveTime = new Date().toISOString()

  if (!todayEntry) {
    try {
      const entryArr = await t.returning(columns)
                              .insert({ user_id: user.id,
                                        date: today,
                                        timezone: timezone,
                                        created_at: saveTime,
                                        updated_at: saveTime })
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
  console.log('ACTIONS -> UPDATE ENTRY->')

  let updatedEntry

  // use the same timestamp for entry.updated_at and activity_log.end
  const updateTime = new Date().toISOString()

  try {
    if (start) await createOrUpdateActivityLog(id, content, wordCount, lowestWordCount, start, updateTime)

    const entryArr = await t.returning(columns)
                            .where({ id })
                            .update({ content,
                                      word_count: wordCount,
                                      updated_at: updateTime})
    updatedEntry = entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return updatedEntry
}

export { findToday, findById, findByDate, findByDateSpan, findAll,
         create, update }
