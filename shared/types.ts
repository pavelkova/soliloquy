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

// export interface ActivityLog {
//   id: number
//   entryId: number
//   start: Date
//   end: Date
//   content: string
//   lowestWordCount: number
//   netWordCount: number
// }

// export interface Entry {
//   id: number
//   userId: number
//   date: string
//   timezone: string
//   content: string
//   wordCount: number
//   createdAt: Date
//   updatedAt: Date
//   activityLogs: ActivityLog[]
// }

export interface DBEntry {
    id: number
    userId: number
    date: string
    timezone: string
    dayStartsAt: number
    createdAt: Date
}

export interface DBActivityLog {
    id: number
    userId: number
    entryId: number
    activityType: string
    content: string
    start: Date
    end: Date
    wordCount: number
}

export interface DBTag {
    id: number
    userId: number
    parentId?: number
    name: string
    createdAt: Date
}

export interface DBEntryTags {
    id: number
    entryId: number
    tagId: number
}

export interface DBEntryEditingLogs {
    id: number
    activeEntryId: number
    editingActivityLogId: number
}

export interface DBEntryAnalysis {
    id: number
    createdAt: Date
    updatedAt: Date
    entryId: number
    activityType: string
    activityLogId: number
}

export interface Entry {
    id: number
    user: User
    date: string
    timezone: string
    dayStartsAt: number
    createdAt: Date
    activityLogs: [ActivityLog]
}

export interface ActivityLog {
    id: number
    user: User
    entry: Entry
    activityType: string
    content: string
    start: Date
    end: Date
    wordCount: number
}

export interface Tag {
    id: number
    user: User
    parent?: Tag
    name: string
    createdAt: Date
}

export interface EntryTags {
    id: number
    entryId: number
    tagId: number
}

export interface EntryEditingLogs {
    id: number
    activeEntryId: number
    editingActivityLogId: number
}

export interface EntryAnalysis {
    id: number
    createdAt: Date
    updatedAt: Date
    entryId: number
    activityType: string
    activityLogId: number
}

export interface EditingLog {
    madeOn: Entry
    editLog: ActivityLog
}
