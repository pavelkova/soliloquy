import { Tag } from './tag'
import { User } from './user'

interface SharedEntry {
    id: number
    date: string
    timezone: string
    dayStartsAt: string
    disableAnalysis: boolean
}

export interface DBEntry extends SharedEntry {
    userId: number
}

export interface Entry extends SharedEntry {
    user: User
    activityLogs?: ActivityLog[]
    tags?: Tag[]
}

export interface DBEntryTags {
    id: number
    entryId: number
    tagId: number
}

export interface DBEntryAnalysis {
    id: number
    createdAt: Date
    updatedAt: Date
    entryId: number
    activityLogId: number
}
