export interface ActivityState {
  isActive: boolean
  start?: Date
}

export interface PauseState {
  isPaused: boolean
  requireManualUnpause: boolean
  pausedMessage?: string
}

// type EntryArgs = Pick<Entry, 'content' | 'wordCount'>

interface SharedEntryInput {
  userId?: number
  content: string
  wordCount: number
  lowestWordCount: number
  start: Date
}

export interface CreateEntryInput extends SharedEntryInput {
  date: string
  timezone: string
}

export interface UpdateEntryInput extends SharedEntryInput {
  id: number
}

// export type EntryInput = CreateEntryInput | UpdateEntryInput

export interface EntryInput {
  userId?: number
  date: string
  timezone: string
  content: string
  wordCount: number
  lowestWordCount: number
  start: Date
}

interface SharedActivityLogInput {
  end: Date
  content: string
  lowestWordCount: number
  wordCount?: number
}

export interface CreateLogInput extends SharedActivityLogInput {
  entryId: number
  start: Date
}

export interface UpdateLogInput extends SharedActivityLogInput {
  id: number
}

export type ActivityLogInput = { wordCount: number } && (CreateLogInput | UpdateLogInput)


// export interface EditorProps = {
//     date: string
//     timezone: string
//     savedEntry: Entry
//     setSavedEntry: any
//     isPaused: boolean
//     pause: any
//     unpause: any
// }
