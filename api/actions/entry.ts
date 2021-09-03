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

const createOrUpdate = (userId: number, date: Date, timezone: string) => {
}

export {
    findEntryByDate, findEntryById, createEntry
}
