import { Entry } from './entry'

interface SharedActivityLog {
    id: number
    content: string
    wordCount: number
    createdAt: Date
    updatedAt: Date
}

export interface DBActivityLog extends SharedActivityLog {
    entryId: number
}

export interface ActivityLog extends SharedActivityLog {
    entry: Entry
}
