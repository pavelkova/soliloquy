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

export interface ActivityLog {
  id: number
  entryId: number
  start: Date
  end: Date
  content: string
  lowestWordCount: number
  netWordCount: number
}

export interface Entry {
  id: number
  userId: number
  date: string
  timezone: string
  content: string
  wordCount: number
  createdAt: Date
  updatedAt: Date
  activityLogs: ActivityLog[]
}
