import { db } from '../db'
import { now, getTimeBetween } from 'utils/date'

const t = db('activity_logs')

const columns = [
  'id',
  'entry_id as entryId',
  'start',
  'end',
  'content',
  'lowest_word_count as lowestWordCount',
  'net_word_count as netWordCount'
]

/**
 * Find an activity log by ID
 *
 * @param id activity log ID
 */
const findById = async (id) => {
  console.log('ACTIONS -> ACTIVITY LOG -> FINDBYID ->')
  let log
  try {
    log = await t.select(columns)
                 .where({ id }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log
}

/**
 * Return an array of all activity logs for a given entry.
 *
 * @param entryId
 */
const findAll = async (entryId) => {
  console.log('ACTIONS -> ACTIVITY LOG -> FINDALL ->')
  let logs
  try {
    logs = await t.select(columns)
                  .where({ entry_id: entryId })
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
  return logs
}

/**
 * Create a new activity log for user's today entry.
 *
 * @param entryId
 * @param content
 * @param lowestWordCount
 * @param netWordCount
 * @param start
*/
const create = async (entryId, content, lowestWordCount, netWordCount, start, end) => {
  console.log('ACTIONS -> ACTIVITY LOG -> CREATE ->')

  let log

  try {
    log = await t.returning(columns)
                 .insert({ entry_id: entryId,
                           content,
                           lowest_word_count: lowestWordCount,
                           net_word_count: netWordCount,
                           start,
                           end })
    console.log(log)
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log[0]
}

/**
 * Update the most recent activity log for user's today entry.
 *
 * @param id
 * @param content
 * @param lowestWordCount
 * @param netWordCount
 */
const update = async (id, content, lowestWordCount, netWordCount, end) => {
  console.log('ACTIONS -> ACTIVITY LOG -> UPDATE ->')

  let log

  try {
    log = await t.returning(columns)
                 .where({ id })
                 .update({ content,
                           lowest_word_count: lowestWordCount,
                           net_word_count: netWordCount,
                           end })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log
}

/**
 * Get activity logs for user's today entry and determine whether to create a new one
 * or update the most recent one.
 *
 * @param entryId
 * @param content
 * @param wordCount
 * @param lowestWordCount
 * @param start
 * @param end
 */
const createOrUpdate = async (entryId, content, wordCount, lowestWordCount, start, end) => {
  console.log('ACTIONS -> ACTIVITYLOGS -> CREATE OR UPDATE ->')

  const logs = await findAll(entryId)
  let currentLog = logs.slice(-1)[0]
  // HACK this should not be necessary?
  if (content == currentLog.content && start == currentLog.start && end == currentLog.end) return
  try {
    const netWordCount = wordCount - lowestWordCount
    // if no logs exist, create the first one
    // or if logs exist but the last change was made more than five minutes ago, create a new log
    if (!currentLog ||
        (getTimeBetween(currentLog.end, start) > 300000)) {
      currentLog = await create(entryId, content, lowestWordCount, netWordCount, start, end)
    } else {
      // otherwise just update the most recent log
      currentLog = await update(currentLog.id, content, lowestWordCount, netWordCount, end)
    }
  } catch(e) {
    console.error(e.message)
    throw new Error(e)
  }
  return currentLog
}

export { findById, findAll,
         create, update,
         createOrUpdate }
