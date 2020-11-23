import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { DateHeader } from './Entry/DateHeader'
import { usePageVisibility } from 'utils/visibility'
import UPDATE_ENTRY  from 'mutations/UpdateEntry.graphql'
import TODAY from 'queries/Today.graphql'

export const Editor = ({ today }) => {

  const isVisible = usePageVisibility()
  const [content, setContent] = useState(today.content || '')
  const [wordCount, setWordCount] = useState(today.wordCount || 0)
  const [lowestWC, setLowestWC] = useState(wordCount)
  /* const [activity, setActivity] = useState({ isActive: false, start: null, lowestWC: wordCount, activityLogID: today.activityLogs[-1]?.id || null }) */
  const [activity, setActivity] = useState({ isActive: false, start: null })
  const [isPaused, setIsPaused] = useState(false)
  const [pause, setPause] = useState({ isPaused: false, manualPause: false })
  const [lastSaved, setLastSaved] = useState({
    content: today.content || '',
    time: new Date(today.updatedAt) || null
  })

  const [result, update] = useMutation(UPDATE_ENTRY)

  function pauseEditor(manualPause = false) {
    console.log('TODAY -> EDITOR -> pauseEditor ->')
    setActivity({ isActive: false, start: null })
    setIsPaused(true)
    setPause({ isPaused: true, manualPause })
  }

  function unpauseEditor() {
    console.log('TODAY -> EDITOR -> unpauseEditor ->')
    setIsPaused(false)
    /* setActivity({ isActive: true, start: new Date() }) */
    const [{ data, fetching, error }] = useQuery(TODAY)
    if (fetching) return <p>Loading...</p>
    if (error) return <p>{ error.message }</p>
    if (data.today) {
      // useful if
      if (content !== data.today.content) {
        setContent(data.today.content)
        setLastSaved({ content: data.today.content, time: new Date(data.today.updatedAt )})

      }
      // reset activity values if a new activity log will be created on the server
      if (new Date() - new Date(data.today.updatedAt) > 50000) {
        setActivity({ isActive: false, start: null })
        setLowestWC(data.today.wordCount)
      }
      setLastSaved({ content: data.today.content, time: new Date(data.today.updatedAt) })
    }
    return
  }

  function measureDuration() {
    /* when page is loaded, check for existing activity logs and calculate their duration
-- on hover or click - show
eventually add something that records low word count after delete key or overwrite and then submits difference between total wordcount on save and lowest wordcount during activity as "newWordCount" and pass to activity log as words during session
then, if isActive, show timer*/
  }

  function handleTextChange(e) {
    // is there a better way to call this than on every keypress
    if (!activity.isActive && content !== lastSaved.content) {
      setActivity({ isActive: true, start: new Date() })
    }

    let text = e.target.value
    let wc = text.split(/([\s]|[-]{2,}|[.]{3,})+/)
                 .filter((word) => {
                   return word.match(/[a-zA-Z]+/)})

    setContent(text)
    setWordCount(wc.length)
  }

  function handleSave() {
    if (content == lastSaved.content) return
    // calculate new word count in this active session
    const netWC = wordCount - lowestWC
    update({ id: today.id,
             content,
             wordCount,
             // netWC,
             startTime: activity.start }).then(result => {
               if (result.error) {
                 setIsPaused(true)
                 // suggest try refreshing the page
                 console.error(result.error)
               }
               const data = result?.data?.updateEntry
               console.log('EDITOR -> USE EFFECT -> UPDATE RESULT')
               console.log(data)
               if (data) {
                 setLastSaved({ content: data.content, time: new Date(data.updatedAt) })
                 console.log(lastSaved.time)
               }
               return data
             })
  }

  // automatically save after three seconds without input
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('EDITOR -> USE EFFECT -> content -> save after three inactive seconds')
      handleSave()
    }, 3000)
    return () => clearTimeout(timer)
  }, [content])

  // set inactive after five minutes without input
  useEffect(() => {
    if (content && !activity.isActive) unpauseEditor()
    const timer = setTimeout(() => {
      console.log('EDITOR -> USEEFFECT -> content -> pause after 3 inactive minutes')
      pauseEditor()
    }, 30000)
    return () => clearTimeout(timer)
  }, [content])

  // set inactive 30 seconds after page loses visibility (tab is switched)
  useEffect(() => {
    console.log('TODAY -> EDITOR -> useEffect / isVisible ->')
    if (isVisible && isPaused) unpauseEditor()
    /* if (isVisible && ) */
    const timer = setTimeout(() => {
      console.log('TODAY -> EDITOR -> pauseEditor due to page visibility ->')
      /* if (!isVisible && !pause.isPaused) { pauseEditor(false) } */
      if (!isVisible) pauseEditor()
    }, 30000)
    return () => clearTimeout(timer)
  }, [isVisible])

  // maybe wrap this in an 'if initial wordcount is greater than zero, set useeffect, otherwise skip'
  // on unpause, only reset lowestWC if a new activitylog has been created -- only change anything if query result has content and/or a new activity log will be created bc result's updated_at is more than five minutes ago
  /* actually maybe try: [activity, setActivity] = useState({ isActive: true, startTime: time, activityLogId: x, lowestWC: x }) */
  useEffect(() => {
    console.log(wordCount, lowestWC)
    if (wordCount < lowestWC) {
      console.log('update lowestWC')
      setLowestWC(wordCount)
    }
    return () => {}
  }, [wordCount])

  return (
    <>
      <DateHeader entry={today} />
      <div>
        {wordCount} {wordCount == 1 ? 'word' : 'words'}
        {/* <button onClick={ setIsPaused(!isPaused)}>{ isPaused ? 'start' : 'pause' }</button> */}
      </div>
      saved at { lastSaved.time.toLocaleString('en-us', { timeStyle: 'short' }) }
      <div></div>
      <textarea onChange={handleTextChange} value={content} />
      <button onClick={handleSave}>save</button>
    </>
  )
}

  /*

COMPONENTS
bar divided into 24 * 15 or 24 * 10, color indicating writing activity

OVER EACH ENTRY
instead of separate page for stats, add slide over drawer
if clicking for today: need to have hit your target in order to mark the day finished. if you choose to do that, your stats will be available but you won't be able to add more words until tomorrow.
if less than 100 words: this entry was too short to analyze!

 */



// get or create entry from SSR
// entry = { content: '', activityLogs: [{ createdAt: time, updatedAt: time, content: ''}, { createdAt: time, updatedAt: time, content: ''}]}

// user preference or default: background, text color, highlight, font name, font size, timezone, word goal
// five minutes to midnight at client time or user preference timezone, if exists

/*
content, wordCount, activityStart, lowestActiveWordCount

if content is updated and is different from lastsaved content ->
if inactive, setIsActive to true (setLastSaved before setContent on requery)
run updateEntry after three seconds

if entry already had content, it should have at least one activity log


if this is the first log: set lowestWordCount to zero
 */
