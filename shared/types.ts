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
    id: string
    email: string
    name?: string
    password: string
    createdAt: Date
    updatedAt: Date
    settings: Settings
}

export interface Entry {
    id: string
    user: User
    date: string
    timezone: string
    disableAnalysis: boolean
    createdAt: Date
    updatedAt: Date
    activityLogs?: ActivityLog[]
    tags?: Tag[]
}

export interface ActivityLog {
    id: string
    entry: Entry
    content: string
    wordCount: number
    lowestWordCount: number
    createdAt: Date
    updatedAt: Date
}

export interface Tag {
    id: string
    user: User
    name: string
    parent?: Tag
    children?: Tag[]
    createdAt: Date
    updatedAt: Date
}
