import React, { useEffect, useState } from 'react'
import { formatWithLocale } from 'utils/date'
import { useQuery, useMutation } from 'urql'
import { UPDATE_ENTRY } from '../lib/graphql/Entry.graphql'

export const Editor = ({ today }) => {
  // get or create entry from SSR
  // entry = { content: '', activityLogs: [{ createdAt: time, updatedAt: time, content: ''}, { createdAt: time, updatedAt: time, content: ''}]}
  const user = today.user
  const titleDate = formatWithLocale(user, { dateStyle: 'long' })
  // user preference or default: background, text color, highlight, font name, font size, timezone, word goal
  // five minutes to midnight at client time or user preference timezone, if exists

  const [isActive, setIsActive] = useState(false)
  const [content, setContent] = useState(today.content || '')
  const [wordCount, setWordCount] = useState(today.wordCount || 0)
  const [lastSaved, setLastSaved] = useState({
    content: '',
    time: new Date(),
  })

  const [result, update] = useMutation(UPDATE_ENTRY)

  function handleTextChange(e) {
    let text = e.target.value
    let wc = text.split(/([\s]|[-]{2,}|[.]{3,})+/)
                 .filter((word) => {
                   return word.match(/[a-zA-Z]+/)})

    setContent(text)
    setWordCount(wc.length)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      update({ content, wordCount }).then(result => {
        if (result.error) {
          // set isPaused, suggest try refreshing the page
          console.error(result.error)
        }
        const data = result.data.updateEntry
        console.log(data)
        if (data) {
          setLastSaved({ content: data.content, time: data.updatedAt })
        }
        return data
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [content])

  useEffect(() => {
    if (content && !isActive) setIsActive(true)
    const timer = setTimeout(() => {
      setIsActive(false)
    }, 30000)
    return () => clearTimeout(timer)
  }, [content])

  const findOut = () => {
    console.log(lastSaved)
  }

  return (
    <>
    <h1>{titleDate}</h1>

      <div>
        {wordCount} {wordCount == 1 ? 'word' : 'words'}
      </div>
    <textarea onChange={handleTextChange} value={content} />
    <button onClick={findOut}>save</button>
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
