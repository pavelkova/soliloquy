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


const findEntryByDate = () => {
}

const findEntryById = () => {
}

interface EntryInput {
    userId: number
    date: string
    timezone: string
    dayStartsAt: string
    disableAnalysis: boolean
}

const findOrCreateEntry = async ({ userId, date, timezone, dayStartsAt, disableAnalysis }: EntryInput): Promise<DBEntry> => {
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
}

const updateDate = async (userId: number, date: Date): Promise<DBEntry> => {
    const entryArr = await t.returning(columns).where({ user_id: userId, date }).update({ date })
    return entryArr[0]
}

const toggleAnalysis = async (id: number, disable_analysis: boolean): Promise<DBEntry> => {
    return await update(id, { disable_analysis })
}

const update = async (id: number, args: Partial<DBEntry>): Promise<DBEntry> => {
    const entryArr = await t.returning(columns).where({ id }).update(args)
    return entryArr[0]
}

export {
    findEntryByDate, findEntryById, findOrCreateEntry
}
