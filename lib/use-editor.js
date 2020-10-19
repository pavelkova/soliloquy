import React, { useEffect, useState } from 'react'
import { formatWithLocale } from 'utils/date'
import { useQuery, useMutation } from 'urql'

export const Editor = () => {
  // get or create entry from SSR
  // five minutes to midnight at client time or user preference timezone, if exists

  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [lastSaved, setLastSaved] = useState({
    content: '',
    time: null
  })

  // on text area update with space: word count
  function handleTextChange(e) {
    if (lastSaved.endTime) {
      // was more than five minutes ago
      setLastSaved()
    }


    let text = e.target.value
    let wc = text
      .split(/([\s]|[-]{2,}|[.]{3,})+/)
      .filter(word => {
        return word.match(/[a-zA-Z]+/)
      })

    setContent(text)
    setWordCount(wc.length)
  }

  const checkOpenActivityLog = logs => {
    if (logs[-1] && !logs[-1].endTime) {
    } else {
    }
  }

  useEffect(() => {
    /* if (!isPaused) setIsPaused(true) */
    const hasOpenActivityLog = Boolean(entry.activityLogs[-1] && !entry.activityLogs[-1].endTime)

    const saveTimer = setInterval(() => {
      if (content != lastSaved.content) {
        // useMutation(UPDATE_ENTRY)
        // if (!entry.activityLogs[-1] || entry.activityLogs[-1].endTime) { createActivityLog(entryId, startTime: new Date) }
        // onSuccess
        setLastSavedContent(content)
      }
    }, 30000)
    return () => clearInterval(saveTimer)
  }, [content])

  useEffect(() => {
    if (content != lastSaved.content) {
      const saveTimer = setInterval(() => {
      }, 30000)
    } else {
      const activeTimer = setInterval(() => {

      }, 300000)
    }
  }, [content, lastSaved])

  /*
     useEffect(() => {
     if (content != lastSaved.content) {
     if (!isActive) setIsActive(true)
     try {
     const now = new Date()
     const [data] = useMutation({
     mutation: UPDATE_ENTRY,
     variables: { content, wordCount, updatedAt: now }
     })
     setLastSaved({ content, time: now })


     } catch (e) {
     }
     }
     }, [content])
     useEffect(() => {
     if (content == lastSaved.content) {
     if (isActive) setIsActive(false)
     const activeTimer = setInterval(() => {
     const openLog = entry.activityLogs[-1]
     if (openLog && !openLog.endTime) {
     const [result, closeOpenLog] = useMutation({
     mutation: UPDATE_ACTIVITY_LOG,
variables: { id: openLog.id, endTime: entry.updatedAt }
     })

// backend
when updating or querying entry {
if (entry.updatedAt > 5 min ago)
if (entry.activityLogs[-1] && !entry.activityLogs[-1].endTime) {
updateActivityLog.where({ id }).update({ endTime: entry.updatedAt })
}
if (!entry.activityLogs[-1] || entry.activityLogs[-1].endTime) {
createActivityLog.where({entry_id: entry.id}).({ start_time: new Date (), content: incoming.content, incoming.wordCount})
}
}

     }
     }, 300000)
     }
     }, [lastUpdated])
   */

  return (
    <>
    <h1>{ titleDate }</h1>
    <div>{ wordCount } { wordCount == 1 ? 'word' : 'words' }</div>
    <textarea onChange={handleTextChange}>{ content }</textarea>
    <button>Save</button>
    </>
  )
}

const activityLogs = () => {
  /* create activity log with start time on first "isActive"
     ways to add end time
     - if window is left open or cache/state is kept in client, isActive turns false after five minutes without a key press, and last saved time is added as end time
     on next key press, isactive is triggered and creates a new activity logsa

     e
     OR
     on query, if entry.activityLogs[-1] has no end time, set it to entry.updated_at

     useEditor() could wrap createEntry, updateEntry, createActivityLog, updateActivityLog

     autosave timer, activity timer, word count

     COMPONENTS
     bar divided into 24 * 15 or 24 * 10, color indicating writing activity

     OVER EACH ENTRY
     instead of separate page for stats, add slide over drawer
     if clicking for today: need to have hit your target in order to mark the day finished. if you choose to do that, your stats will be available but you won't be able to add more words until tomorrow.
     if less than 100 words: this entry was too short to analyze!

   */
}
