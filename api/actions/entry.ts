import knex from 'knex'
import { db } from 'db'
import { Entry, ActivityLog, User } from 'shared/types'
import {
  CreateEntryInput,
  UpdateEntryInput,
  EntryInput,
} from 'shared/types/editor'
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
  'updated_at as updatedAt',
]

/** Return a single entry by its ID.
 * @param {Integer} id
 *
 * @return {Object} entry
 */

const findById = async (userId: number, id: number): Promise<Entry> => {
  console.log('ACTIONS -> FIND ENTRY BY ID ->')

  try {
    const entryArr = await t.select(columns).where({ user_id: userId, id })
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
const findByDate = async (userId: number, date: string): Promise<Entry> => {
  console.log('ACTIONS -> FIND ENTRY BY DATE ->')

  try {
    const entryArr = await t.select(columns).where({ user_id: userId, date })
    console.log(entryArr)
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
//
const findByDateSpan = async (userId: number, dateSpan): Promise<Entry[]> => {
  console.log('ACTIONS -> FIND ENTRIES BY DATES ->')

  const { fromDate, toDate } = dateSpan

  try {
    return await t
      .select(columns)
      .where({ user_id: userId })
      .whereBetween('date', [fromDate, toDate])
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

/**
 * Find all entries for the authorized user.
 *
 * @param user User object passed from GraphQL context.
 */
const findAll = async (userId: number): Promise<Entry[]> => {
  console.log('ACTIONS -> FIND ALL ENTRIES ->')

  try {
    return await t.select(columns).where({ user_id: userId })
  } catch (e) {
    console.error(e.message)
  }
}

/**
 * Initialize today's entry for the authorized user if it does not exist.
 *
 * @param user User object passed from GraphQL context.
 */
const create = async (args: CreateEntryInput): Promise<Entry> => {
  console.log('ACTIONS -> CREATE ENTRY ->')

  // use same timestamp for created_at and initial updated_at
  const saveTime = new Date().toISOString()

  try {
    const entryArr = await t.returning(columns).insert({
      user_id: args.userId,
      date: args.date,
      timezone: args.timezone,
      content: args.content,
      word_count: args.wordCount,
      created_at: args.start,
      updated_at: saveTime,
    })
    const entry = entryArr[0]
    await createOrUpdateActivityLog(
      entry.id,
      args.content,
      args.wordCount,
      args.lowestWordCount,
      args.start,
      saveTime
    )
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
 * @param id number
 * @param content string
 * @param wordCount
 * @param lowestWordCount
 * @param start
 */
const update = async (args: UpdateEntryInput): Promise<Entry> => {
  const { id, content, wordCount, lowestWordCount, start } = args
  console.log('ACTIONS -> UPDATE ENTRY->')

  // use the same timestamp for entry.updated_at and activity_log.end
  const updateTime = new Date().toISOString()

  try {
    await createOrUpdateActivityLog({
      entryId: id,
      content,
      wordCount,
      lowestWordCount,
      start,
      end: updateTime,
    })

    const entryArr = await t
      .returning(columns)
      .where({ id })
      .update({ content, word_count: wordCount, updated_at: updateTime })
    return entryArr[0]
  } catch (e) {
    // TODO if error is "entry already exists", return content argument appended to saved content with intermediate conflict message (but save nothing new to database)
    console.error(e.message)
    throw new Error(e)
  }
}

const createOrUpdate = async (args: EntryInput): Promise<Entry> => {
  console.log('ACTIONS -> ENTRY -> CREATE OR UPDATE ->')
  const now = new Date().toISOString()

  try {
    // const entryArr = await t
    //   .returning(columns)
    //   .insert({
    //     user_id: args.userId,
    //     date: args.date,
    //     timezone: args.timezone,
    //     content: args.content,
    //     word_count: args.wordCount,
    //     created_at: args.start,
    //     updated_at: now,
    //   })
    //     .onConflict(['user_id', 'date'])
      //   .merge(['content', 'word_count', 'updated_at'])

    const values = {
      user_id: args.userId,
      date: args.date,
      timezone: args.timezone,
      content: args.content,
      word_count: args.wordCount,
      created_at: args.start,
      updated_at: now,
    }

    const entryArr = await db.raw(`
        ? ON CONFLICT (user_id, date)
        DO UPDATE SET
          content=EXCLUDED.content,
          word_count=EXCLUDED.word_count,
          updated_at=EXCLUDED.updated_at
        RETURNING ` + columns + `;`,
      [t.insert(values)])

      const entry = entryArr.length ? entryArr[0] : entryArr.rows[0]
      console.log(entryArr)
    await createOrUpdateActivityLog({
      entryId: entry.id,
      content: args.content,
      wordCount: args.wordCount,
      lowestWordCount: args.lowestWordCount,
      start: args.start,
      end: entry.updated_at,
    })
    return entry
  } catch (e) {
    console.error(e.message)
    throw new Error(e)
  }
}

export {
  findById,
  findByDate,
  findByDateSpan,
  findAll,
  create,
  update,
  createOrUpdate,
}
