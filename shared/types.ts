export interface Settings {
  timezone?: string
  wordCountGoal: number
  timeFormat: string
  dayStartsAt: string
  textAnalysis: boolean
  theme: string
  fontName: string
  fontSize: number
  backgroundColor?: string
  textColor?: string
  highlightColor?: string
}

export interface User {
  id: number
  name: string
  email: string
  password: string
  settings: Settings
}

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

interface SharedTag {
    id: number
    name: string
    createdAt: Date
}

export interface DBTag extends SharedTag {
    userId: number
    parentId?: number
}

export interface Tag extends SharedTag {
    user: User
    parent?: Tag
    children?: [Tag]
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
