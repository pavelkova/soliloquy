import knex from 'knex'
import { db } from 'db'

const t = db('entries')
const columns = [
    'id',
    'user_id as userId',
    'date',
    'timezone',
    'day_starts_at as dayStartsAs',
    'enable_analysis as enableAnalysis',
    'created_at as createdAt',
    'updated_at as updatedAt'
]
