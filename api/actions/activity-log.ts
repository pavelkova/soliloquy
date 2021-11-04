import knex from 'knex'
import { db } from 'db'
import { findOrCreateEntry } from './entry'
import { DBActivityLog } from 'shared/types/activity-log'
import { DBEntry } from 'shared/types/entry'

const t = db('activity_logs')
const columns = [
    'id',
    'entry_id as entryId',
    'content',
    'created_at as createdAt',
    'updated_at as updatedAt',
    'word_count as wordCount'
]

const findByEntry = async (entryId: number): Promise<DBActivityLog[]> => {
    try {
        return await t.select(columns).where({ entry_id: entryId })
    } catch(e) {
        console.error(e)
        throw new Error(e)
    }
}

const findCurrentByEntry = async (entryId: number): Promise<DBActivityLog> => {
    try {
        const logArr = await t.select(columns).where({ entry_id: entryId })
        if (logArr[-1]) {
            const updated = logArr[-1].updated_at
            const minuteDifference = (updated.getTime() - new Date().getTime()) / (1000 * 60)
            if (minuteDifference <= 5) return logArr[-1]
        }
        return null
    } catch(e) {
        console.error(e)
        throw new Error(e)
    }
}

// const createOrUpdate = async (entryId: number, createdAt: Date, content: string, wordCount: number) => {
//     const logArr = await t
//         .returning(columns)
//         .insert({
//             entry_id: entryId,
//             content,
//             created_at: createdAt,
//             word_count: wordCount})
//         .onConflict(['entry_id', 'created_at'])
//         .merge(['content', 'word_count', 'updated_at'])
//     return logArr[-1]

//     // const logArr = await db.raw(`
//     //     ? ON CONFLICT (entry_id, created_at)
//     //     DO UPDATE SET
//     //       content=EXCLUDED.content,
//     //       word_count=EXCLUDED.word_count,
//     //       updated_at=EXCLUDED.updated_at
//     //     RETURNING ` + columns + `;`,
//     //   [t.insert(values)])
// }

// TODO make this from union of activity log and entry types
interface EntryLogInput {
    userId: number
    date: string
    timezone: string
    dayStartsAt: string
    disableAnalysis: boolean
    createdAt: Date
    content: string
    wordCount: number
    entryId?: number
}

const createOrUpdate = async ({ userId, date, timezone, dayStartsAt, disableAnalysis, createdAt, content, wordCount, entryId }: EntryLogInput): Promise<DBActivityLog> => {
    if (!entryId) {
        const entry: DBEntry = await findOrCreateEntry({ userId, date, timezone, dayStartsAt, disableAnalysis })
        entryId = entry.id
    }

    return await t
        .returning(columns)
        .insert({
            entry_id: entryId,
            content,
            created_at: createdAt,
            word_count: wordCount})
        .onConflict(['entry_id', 'created_at'])
        .merge(['content', 'word_count', 'updated_at'])

    // const logArr = await db.raw(`
    //     ? ON CONFLICT (entry_id, created_at)
    //     DO UPDATE SET
    //       content=EXCLUDED.content,
    //       word_count=EXCLUDED.word_count,
    //       updated_at=EXCLUDED.updated_at
    //     RETURNING ` + columns + `;`,
    //   [t.insert(values)])
}

// on page load: send user id, current user settings (timezone, day offset), date -> find entry + most recent log (find entry by user & date, if exists, find newest log) -> set local entry state + content, etc from log
// if no local entry state, on start typing: create entry -> set local entry state
// on save: find entry + most recent log (if no recent log, or if recent log and log.lastUpdated is more than five minutes before now, create new log) -> set local entry state + content, etc from log
// on unpause/page refocus: get current log
// wrap pause, etc functions in function to return if no entry
