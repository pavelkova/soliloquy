import { db } from '../db'
import { findById as findEntryById } from './entry'

const t = db('activity_logs')

const columns = [
  'id',
  'entry_id as entryId',
  'start',
  'end',
  'content',
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

const create = async (entryId, start, end, content) => {
  console.log('ACTIONS -> ACTIVITY LOG -> CREATE ->')
  let log
  /* const started = new Date(parseInt(start))
   * const ended = new Date(parseInt(end)) */
  try {
    log = await t.returning(columns)
                 .insert({ entry_id: entryId,
                           start: started,
                           end: ended })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log[0]
}

const update = async (id, content, start, end) => {
  console.log('ACTIONS -> ACTIVITY LOG -> UPDATE ->')
  let log
  try {
    log = await t.returning(columns)
                 .where({ id })
                 .update({ content,
                           start,
                           end })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
  return log
}

export { findById, findAll,
         create, update }
