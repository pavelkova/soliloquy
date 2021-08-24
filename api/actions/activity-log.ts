import knex from 'knex'
import { db } from 'db'

const t = db('activity_logs')
const columns = [
    'id',
    'user_id as userId',
    'entry_id as entryId',
    'content',
    'start',
    'end',
    'word_count as wordCount',
    'created_at as createdAt',
    'updated_at as updatedAt'
]

const findByEntry = (entryId: number) => {
    return
}

const findCurrent = (entryId: number, start: Date) => {
}
