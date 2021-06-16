import { db } from 'db'
import { Entry, ActivityLog } from 'shared/types'
import { now, getTimeBetween } from 'utils/date'
import {
  ActivityLogInput,
  CreateLogInput,
  UpdateLogInput,
} from 'shared/types/editor'

const t = db('activity_logs')

const columns = [
  'id',
  'entry_id as entryId',
  'start',
  'end',
  'content',
  'lowest_word_count as lowestWordCount',
  'net_word_count as netWordCount',
]

/**
 * Find an activity log by ID
 *
 * @param id activity log ID
 */
const findById = async (id: number): Promise<ActivityLog> => {
  console.log('ACTIONS -> ACTIVITY LOG -> FINDBYID ->')
  try {
    return await t.select(columns).where({ id }).first()
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/**
 * Return an array of all activity logs for a given entry.
 *
 * @param entryId
 */
const findAll = async (entryId: number): Promise<ActivityLog[]> => {
  console.log('ACTIONS -> ACTIVITY LOG -> FINDALL ->')
  try {
    return await t.select(columns).where({ entry_id: entryId })
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
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
// const create = async (entryId: number,
//                       content: string,
//                       lowestWordCount: number,
//                       netWordCount: number,
//                       start: Date,
//                       end: Date): Promise<ActivityLog> => {
const create = async (args: CreateLogInput): Promise<ActivityLog> => {
  console.log('ACTIONS -> ACTIVITY LOG -> CREATE ->')
  try {
    const logArr = await t.returning(columns).insert({
      entry_id: args.entryId,
      content: args.content,
      lowest_word_count: args.lowestWordCount,
      net_word_count: netWordCount,
      start: args.start,
      end: args.end,
    })
    return logArr[0]
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/**
 * Update the most recent activity log for user's today entry.
 *
 * @param id
 * @param content
 * @param lowestWordCount
 * @param netWordCount
 * @param end
 */
const update = async (args: UpdateLogInput) => {
  console.log('ACTIONS -> ACTIVITY LOG -> UPDATE ->')
  try {
    return await t.returning(columns).where({ id: args.id }).update({
      content: args.content,
      lowest_word_count: args.lowestWordCount,
      net_word_count: netWordCount,
      end: args.end,
    })
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
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
// const createOrUpdate = async (args: ActivityLogInputs): Promise<ActivityLog> => {
const createOrUpdate = async (
  args: ActivityLogInputs
): Promise<ActivityLog> => {
  console.log('ACTIONS -> ACTIVITYLOGS -> CREATE OR UPDATE ->')

  const netWordCount = args.wordCount - args.lowestWordCount

  const variables = {
    content: args.content,
    lowest_word_count: args.lowestWordCount,
    net_word_count: netWordCount,
    end: args.end,
  }

  const logs = await findAll(args.entryId)
  let currentLog = logs?.slice(-1)[0]

  // if no logs exist, create the first one
  // or if logs exist but the last change was made more than five minutes ago, create a new log
  if (!currentLog || getTimeBetween(currentLog.end, start) > 300000) {
    try {
      // currentLog = await create({ ...variables })
      const logArr = await t
        .returning(columns)
        .insert({ entry_id: args.entryId, start: args.start, ...variables })
      currentLog = logArr[0]
    } catch (e) {
      console.error(e.message)
      throw new Error(e)
    }
  } else {
    // otherwise just update the most recent log
    try {
      // currentLog = await update({ id: currentLog.id, ...variables })
      currentLog = await t
        .returning(columns)
        .where({ id: currentLog.id })
        .update({ ...variables })
    } catch (e) {
      console.error(e.message)
      throw new Error(e)
    }
  }
  return currentLog
}

export { findById, findAll, create, update, createOrUpdate }
