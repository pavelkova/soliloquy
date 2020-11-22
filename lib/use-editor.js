import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'urql'
import { formatWithLocale, getTimeSince } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import TODAY from 'queries/Today.graphql'
import UPDATE_ENTRY from 'mutations/UpdateEntry.graphql'

export const useEditor = ({ today }) => {
  const isVisible = usePageVisibility()
  const [content, setContent] = useState(today.content || '')
  const [wordCount, setWordCount] = useState(today.wordCount || 0)
  const [lowestWordCount, setLowestWordCount] = useState(wordCount)
  const [lastSaved, setLastSaved] = useState({
    content: today.content || '',
    time: new Date(today.updatedAt) || null
  })
  const [activity, setActivity] = useState({
    isActive: false,
    startTime: null

  })
  const [pause, setPause] = useState({
    isPaused: false,
    requireManualUnpause: false
  })

  function handleTextChange(e) {
  }

  function handleSave() {
  }

  function handlePause() {
  }

  function pauseEditor() {
  }

  function unpauseEditor() {

    const [{ data, fetching, error }] = useQuery(TODAY)
    if (data && data.today) {
      if (content != data.today.content) {
        setContent(data.today.content)
      }
      if (lastSaved.content != data.today.content ||
          lastSaved.time != new Date(data.today.updatedAt)) {
        setLastSaved({
          content: data.today.content,
          time: new Date(data.today.updatedAt)
        })
      }

      getActivityFromQuery(data.today.activityLogs)
    }
  }

  function getActivityFromQuery(activityLogs) {
    const recentLog = activityLogs[-1]
    if (recentLog && (getTimeSince(recentLog.end) < 300000)) {
      setActivity({ isActive: true, startTime: new Date(recentLog.start) })
    } else {
      setActivity({ isActive: false, startTime: null })
    }
    return
  }

  // auto save
  // auto pause due to inactivity
  useEffect(() => {
    if (!activity.isActive && content) {
      setActivity({ isActive: true, startTime: new Date() })
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
    if (isVisible && pause.isPaused) { unpauseEditor() }
    // wait 30 seconds before requiring requery
    const timer = setTimeout(() => {
      if (!isVisible) pauseEditor()
    }, 30000)
    return () => clearTimeout(timer)
  }, [isVisible])

  // monitor for new lowest word count to pass to current activity log
  useEffect(() => {
    if (wordCount < lowestWordCount) { setLowestWordCount(wordCount) }
    return () => {}
  }, [wordCount])

  return { content, wordCount, lastSavedAt: lastSaved.time, isPaused: pause.isPaused, handleSave, handleTextChange, handlePause}

}
