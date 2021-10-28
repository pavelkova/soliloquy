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
