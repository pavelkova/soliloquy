import knex from 'knex'
import { db } from 'db'
import { DBEntry} from 'shared/types/entry'

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


const findEntryByDate = async (userId: number, date: string): Promise<DBEntry> => {
    try {
        const entryArr = await t.select(columns).where({ user_id: userId, date })
        return entryArr[0]
    } catch (e) {
        console.error(e)
    }
}

const findEntryById = async (userId: number, id: number): Promise<DBEntry> => {
    try {
        const entryArr = await t.select(columns).where({ user_id: userId, id })
        return entryArr[0]
    } catch (e) {
        console.error(e)
    }
}

interface EntryInput {
    userId: number
    date: string
    timezone: string
    dayStartsAt: string
    disableAnalysis: boolean
}

const findOrCreateEntry = async (args: EntryInput): Promise<DBEntry> => {
    const { userId, date, timezone, dayStartsAt, disableAnalysis } = args

    try {
        const entryArr: DBEntry[] = await t
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
    } catch (e) {
        console.error(e)
    }
}

const updateDate = async (userId: number, date: Date): Promise<DBEntry> => {
    try {
        const entryArr = await t.returning(columns).where({ user_id: userId, date }).update({ date })
        return entryArr[0]
    } catch (e) {
        console.error(e)
    }
}

const update = async (id: number, args: Partial<DBEntry>): Promise<DBEntry> => {
    try {
        const entryArr = await t.returning(columns).where({ id }).update(args)
        return entryArr[0]
    } catch (e) {
        console.error(e)
    }
}

const toggleAnalysis = async (id: number, disableAnalysis: boolean): Promise<DBEntry> => {
    try {
        return await update(id, { disable_analysis: disableAnalysis })
    } catch (e) {
        console.error(e)
    }
}

const updateEntryWithSettings = async (id: number, timezone: string, dayStartsAt: string): Promise<DBEntry> => {
    try {
        return await update(id, { timezone, day_starts_at: dayStartsAt })
    } catch (e) {
        console.error(e)
    }
}

export {
    findEntryByDate, findEntryById, findOrCreateEntry
}
