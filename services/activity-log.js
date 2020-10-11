import { db, fieldAs } from 'db'

export const activityLogService = () => {
  const t = db('activity_logs')
  const columns = ['id',
                   'entry_id as entryId',
                   'start_time as startTime',
                   'end_time as endTime',
                   'content']

  const findLogById = async id => {
    return await t
      .select(columns).where({ id }).first()
    }
    const findAllLogs = async entry => {
      return await t.select(columns)
                    .where({ entry_id: entry.id })
    }

  const createLog = async (entry, startTime, endTime) => {
      return await t
        .returning(columns).insert({
          entry_id: entry.id,
          start_time: startTime,
          end_time: endTime })
    }

    const updateLog = async (id, content, startTime, endTime) => {
      return await t
        .where({ id })
        .update({ content,
                  start_time: startTime,
                  end_time: endTime })
        .returning(columns)
    }

    return { findLogById, findAllLogs, createLog, updateLog }
}
