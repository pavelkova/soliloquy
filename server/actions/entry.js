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

/** Return a single entry by its ID.
 * @param {Integer} id
 *
 * @return {Object} entry
 */
const findById = async (user, id) => {
  console.log('ACTIONS -> FIND ENTRY BY ID ->')

  try {
    const entryArr = await t.select(columns)
                            .where({ user_id: user.id, id })
    return entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/**
 * Return a single entry for the authorized user that matches the given date
 *
 * @param date String representing the date in format "yyyy-mm-dd"
 */
const findByDate = async (user, date) => {
  console.log('ACTIONS -> FIND ENTRY BY DATE ->')

  try {
    const entryArr = await t.select(columns)
                            .where({ user_id: user.id, date })
    return entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/**
 * Return an array of user's entries between two given dates
 *
 * @param {String} fromDate Query start date in format "yyyy-mm-dd"
 * @param {String} toDate   Query end date in format "yyyy-mm-dd"
 */
const findByDateSpan = async(user, dateSpan) => {
  console.log('ACTIONS -> FIND ENTRIES BY DATES ->')

  const { fromDate, toDate } = dateSpan

  try {
    return await t.select(columns)
                  .where({ user_id: user.id})
                  .whereBetween('date', [fromDate, toDate])

  } catch(e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/**
 * Find all entries for the authorized user.
 *
 * @param user User object passed from GraphQL context.
 */
const findAll = async user => {
  console.log('ACTIONS -> FIND ALL ENTRIES ->')

  try {
    return await t.select(columns)
                  .where({ user_id: user.id })
  } catch (e) {
    console.error(e.message)
  }
}

/**
 * Determine today's date for the logged-in user's preferred timezone
 * and return an entry matching its yyyy-mm-dd, if one exists.
 *
 * @param {Object} user Object from GraphQL context with user id, email, and browser timezone
 *
 * @return {Object} String of today's date in user's locale and today's entry, if it does exist.
 */

const findToday = async (user) => {
  console.log('ACTIONS -> FIND TODAY ->')

  const today = formatEntryDate(user.tz)
  const entry = await findByDate(user, today)

  return { today, entry }
}

/**
 * Initialize today's entry for the authorized user if it does not exist.
 *
 * @param user User object passed from GraphQL context.
 */
const create = async (user, today) => {
  console.log('ACTIONS -> CREATE ENTRY ->')

  // use same timestamp for created_at and initial updated_at
  const saveTime = new Date().toISOString()

  try {
    const entryArr = await t.returning(columns)
                            .insert({ user_id: user.id,
                                      date: today,
                                      timezone: user.tz,
                                      created_at: saveTime,
                                      updated_at: saveTime })
    return entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
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

  // use the same timestamp for entry.updated_at and activity_log.end
  const updateTime = new Date().toISOString()

  try {
    if (start) await createOrUpdateActivityLog(id, content,
                                               wordCount, lowestWordCount,
                                               start, updateTime)

    const entryArr = await t.returning(columns)
                            .where({ id })
                            .update({ content,
                                      word_count: wordCount,
                                      updated_at: updateTime})
    return entryArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

const findOrCreateToday = async (user) => {
  console.log('ACTIONS -> ENTRY -> FIND OR CREATE TODAY ->')

  const { today, entry } = await findToday(user)

  return entry ?? await create(user, today)
}

export { findToday, findById, findByDate, findByDateSpan, findAll,
         findOrCreateToday,
         create, update }

// [FIXME] consider moving "isPaused" from useEditor to its own component or hook, and run findOrCreateEntry mutation based on pause state from within Editor component to then feed useEditor with a new or refreshed today object, if required
// OR is this where we use a subscription
