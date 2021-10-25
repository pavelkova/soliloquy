import knex from 'knex'
import { db } from 'db'

const t = db('entries')
const columns = [
    'id',
    'user_id as userId',
    'date',
    'timezone',
    'day_starts_at as dayStartsAs',
    'disable_analysis as disableAnalysis',
    'created_at as createdAt',
    'updated_at as updatedAt'
]


const findEntryByDate = () => {
}

const findEntryById = () => {
}

interface EntryInput {
    userId: number
    date: Date
    timezone: string
    dayStartsAt: string
    disableAnalysis: boolean
}

const findOrCreateEntry = async ({ userId, date, timezone, dayStartsAt, disableAnalysis }: EntryInput) => {
    const entryArr = await t
        .returning(columns)
        .where({ user_id: userId, date })
        .onNotExists(t
        .returning(columns)
        .insert({ user_id: userId,
                  date,
                  timezone,
                  day_starts_at: dayStartsAt,
                  disable_analysis: disableAnalysis }))
    return entryArr[0]
}

const update = async (userId: number, date: Date) => {
    const entryArr = await t.returning(columns).where({ user_id: userId, date }).update({ date })
}

export {
    findEntryByDate, findEntryById, findOrCreateEntry
}
