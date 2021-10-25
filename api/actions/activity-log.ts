import knex from 'knex'
import { db } from 'db'
import { findOrCreateEntry } from './entry'

const t = db('activity_logs')
const columns = [
    'id',
    'entry_id as entryId',
    'content',
    'created_at as createdAt',
    'updated_at as updatedAt',
    'word_count as wordCount'
]

const findByEntry = async (entryId: number): Promise<ActivityLog[]> => {
    try {
        return await t.select(columns).where({ entry_id: entryId })
    } catch(e) {
        console.error(e)
        throw new Error(e)
    }
}

const findCurrentByEntry = async (entryId: number) => {
    try {
        const logArr = await t.select(columns).where({ entry_id: entryId })
        if (logArr[-1]) {
            const updated = logArr[-1].updated_at
            const minuteDifference = (updated.getTime() - new Date.getTime()) / (1000 * 60)
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

interface EntryLogInput {
    userId: number
    date: string
    timezone: string
    dayStartsAt: string
    createdAt: Date
    content: string
    wordCount: number
    entryId?: number
}

const createOrUpdate = async ({ userId, date, timezone, dayStartsAt, createdAt, content, wordCount, entryId }: EntryLogInput) => {
    if (!entryId) {
        const entry = createOrUpdateEntry(userId, date, timezone, dayStartsAt)
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
