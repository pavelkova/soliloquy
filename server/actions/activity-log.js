import { db } from '../db'
import { findById as findEntryById } from './entry'

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

const findAll = async (entryId) => {
  console.log('ACTIONS -> ACTIVITY LOG -> FINDALL ->')
  let logs
  try {
    logs = await t.select(columns)
                  .where({ entry_id: entryId })
    /* if (logs[-1] && !logs[-1].end) {
     *   const closedLog = await t.returning(columns)
     *                            .where({ id: entryLogs[-1].id })
     *                            .update({ end: entry.updatedAt })
     * } */
    console.log(logs)
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
  return logs
}

const create = async (entryId, content, lowestWordCount, netWordCount, start) => {
  console.log('ACTIONS -> ACTIVITY LOG -> CREATE ->')
  let log
  /* const started = new Date(parseInt(start))
   * const ended = new Date(parseInt(end)) */

  try {
    log = await t.returning(columns)
                 .insert({ entry_id: entryId,
                           content,
                           lowest_word_count: lowestWordCount,
                           net_word_count: netWordCount,
                           start,
                           // FIXME date function
                           end: new Date() })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log[0]
}

const update = async (id, content, lowestWordCount, netWordCount) => {
  console.log('ACTIONS -> ACTIVITY LOG -> UPDATE ->')
  let log
  try {
    log = await t.returning(columns)
                 .where({ id })
                 .update({ content,
                           lowest_word_count: lowestWordCount,
                           net_word_count: netWordCount,
                           // FIXME date function
                           end: new Date() })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log
}

const createOrUpdate = async (entryId, content, wordCount, lowestWordCount, start) => {
  console.log('ACTIONS -> ACTIVITYLOGS -> CREATE OR UPDATE ->')
  const logs = findAll(entryId)
  const currentLog = logs[-1]

  const netWordCount = wordCount - lowestWordCount

  // if no logs exist, create the first one
  // or if logs exist but the last change was made more than five minutes ago, create a new log
  if (!currentLog ||
      // FIXME date function
      (new Date(start) - new Date(currentLog.end) > 50000)) {
    return create(entryId, content, lowestWordCount, netWordCount, start)
  }
  // otherwise just update the most recent log
  return update(currentLog.id, content, lowestWordCount, netWordCount)
}

export { findById, findAll,
         create, update,
         createOrUpdate }
