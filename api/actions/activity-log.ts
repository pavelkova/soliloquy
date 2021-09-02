import knex from 'knex'
import { db } from 'db'

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

const findCurrent = (entryId: number) => {
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

const findOrCreate = (entryId: number, createdAt: Date) => {
    const logArr = await t
        .returning(columns)
        .insert({
            entry_id: entryId,
            content,
            created_at: start,
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
