import React, { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { now, getTimeSince } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import TODAY from 'queries/Today.graphql'
import UPDATE_ENTRY from 'mutations/UpdateEntry.graphql'

export const useEditor = ({ today }) => {
  const [updateResult, executeUpdate] = useMutation(UPDATE_ENTRY)

  console.log(today)
  const isVisible = usePageVisibility()
  const [content, setContent] = useState(today.content || '')
  const [wordCount, setWordCount] = useState(today.wordCount || 0)
  const [lowestWordCount, setLowestWordCount] = useState(wordCount)
  const [lastSaved, setLastSaved] = useState({
    content: today.content,
    time: today.updatedAt})
  const [activity, setActivity] = useState({
    isActive: false,
    startTime: ''
  })
  const [pause, setPause] = useState({
    isPaused: false,
    requireManualUnpause: false
  })

  function handleTextChange(e) {
    let text = e.target.value
    let wc = text.split(/([\s]|[-]{2,}|[.]{3,})+/)
                 .filter(word => {
                   return word.match(/[a-zA-Z]+/)})

    setContent(text)

    if (wc.length != wordCount) setWordCount(wc.length)
  }

  function handleSave() {
    console.log('EDITOR -> handleSave ->')
    if (content == lastSaved.content) return
    executeUpdate({ id: today.id,
                    content,
                    wordCount,
                    activity: {
                      start: activity.startTime,
                      lowestWordCount
                    }
    }).then(result => {
      if (result.error) {
        pauseEditor()
        console.error(result.error)
      }
      const data = result?.data?.updateEntry
      if (data) {
        setLastSaved({ content: data.content,
                       time: data.updatedAt })
      }
      return data
    })

  }

  function handlePause() {
  }

  function pauseEditor() {
  }

  function unpauseEditor() {
    // reload from server in case entry has been changed elsewhere
    const [{ data, fetching, error }] = useQuery(TODAY)
    if (data && data.today) {
      if (content != data.today.content) {
        setContent(data.today.content)
      }
      if (lastSaved.content != data.today.content ||
          lastSaved.time != data.today.updatedAt) {
        setLastSaved({
          content: data.today.content,
          time: data.today.updatedAt
        })
      }

      getActivityFromQuery(data.today.activityLogs)
    }
  }

  function getActivityFromQuery(activityLogs) {
    // TODO check that times are processed correctly
    const recentLog = activityLogs[-1]
    if (recentLog && (getTimeSince(recentLog.end) < 300000)) {
      setActivity({ isActive: true, startTime: recentLog.start })
    } else {
      setActivity({ isActive: false, startTime: '' })
    }
    return
  }

  // auto save
  // auto pause due to inactivity
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> content ->')

    if (!activity.isActive && content) {
      setActivity({ isActive: true, startTime: now() })
      console.log('SET ACTIVITY ->')
      console.log(activity)
    }
    const autoSaveTimer = setTimeout(() => { handleSave() }, 3000)
    const autoPauseTimer = setTimeout(() => { pauseEditor() }, 300000)
    return () => {
      clearTimeout(autoSaveTimer)
      clearTimeout(autoPauseTimer)
    }
  }, [content])


  // auto pause due to page losing focus
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> isVisible ->')

    if (isVisible && pause.isPaused) { unpauseEditor() }
    // wait 30 seconds before requiring requery
    const timer = setTimeout(() => {
      if (!isVisible) pauseEditor()
    }, 30000)
    return () => clearTimeout(timer)
  }, [isVisible])

  // monitor for new lowest word count to pass to current activity log
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> wordCount ->')

    if (wordCount < lowestWordCount) { setLowestWordCount(wordCount) }
    return () => {}
  }, [wordCount])

  console.log(lastSaved)

  return { content, wordCount, lastSavedAt: lastSaved.time, isPaused: pause.isPaused, handleSave, handleTextChange, handlePause }

}
