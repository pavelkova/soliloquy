import { db } from '../db'
import { findById as findEntryById } from './entry'

const t = db('activity_logs')

const columns = [
  'id',
  'entry_id as entryId',
  'start_time as startTime',
  'end_time as endTime',
  'content',
]

const findById = async (id) => {
  return await t.select(columns)
                .where({ id }).first()
}

const findAll = async (entry) => {
  const entryLogs = await t.select(columns)
                           .where({ entry_id: entry.id })

  if (entryLogs[-1] && !entryLogs[-1].end_time) {
    const closedLog = await t.returning(columns)
                             .where({ id: entryLogs[-1].id })
                             .update({ end_time: entry.updatedAt })
  }

  return entryLogs
}

const create = async (entry, startTime, endTime) => {
  return await t.returning(columns)
                .insert({ entry_id: entry.id,
                          start_time: startTime,
                          end_time: endTime })
}

const update = async (id, content, startTime, endTime) => {
  return await t.returning(columns)
                .where({ id })
                .update({ content,
                          start_time: startTime,
                          end_time: endTime })
}

export { findById, findAll,
         create, update }
