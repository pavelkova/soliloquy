import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'urql'
import { now, getTimeSince } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import UPDATE_ENTRY from 'mutations/UpdateEntry.graphql'

export const useEditor = ({ today }) => {
  const router = useRouter()
  const isVisible = usePageVisibility()

  const [updateResult, executeUpdate] = useMutation(UPDATE_ENTRY)

  const [content, setContent] = useState(today.content || '')
  const [wordCount, setWordCount] = useState(today.wordCount || 0)
  const [lowestWordCount, setLowestWordCount] = useState(wordCount)

  const [lastSaved, setLastSaved] = useState({
    content: today.content, time: today.updatedAt })
  const [activity, setActivity] = useState({ isActive: false, startTime: '' })
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
        return result.error
      }
      const data = result?.data?.updateEntry
      if (data) {
        console.log('EDITOR -> handleSave -> IF DATA ->')
        setLastSaved({ content: data.content,
                       time: data.updatedAt })
      }
      return data
    })
  }

  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> content ->')

    if (!activity.isActive && content) {
      console.log('setActivity')
      setActivity({ isActive: true, startTime: now() })
    }
    const autoSaveTimer = setTimeout(() => { handleSave() }, 3000)
    const autoPauseTimer = setTimeout(() => { pauseEditor() }, 300000)
    return () => {
      clearTimeout(autoSaveTimer)
      clearTimeout(autoPauseTimer)
    }
  }, [content])

  // monitor for new lowest word count to pass to current activity log
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> wordCount ->')

    if (wordCount < lowestWordCount) { setLowestWordCount(wordCount) }
    return () => {}
  }, [wordCount])

  function setActivityFromQuery(activityLogs) {
    console.log('EDITOR -> setActivityFromQuery ->')
    // TODO check that times are processed correctly
    const recentLog = activityLogs.slice(-1)[0]
    if (recentLog && (getTimeSince(recentLog.end) < 300000)) {
      setActivity({ isActive: true, startTime: recentLog.start })
    } else {
      setActivity({ isActive: false, startTime: '' })
    }
    return
  }

  function pauseEditor(requireManualUnpause = true) {
    console.log('EDITOR -> pauseEditor ->')
    setActivity({ isActive: false, startTime: '' })
    setPause({ isPaused: true, requireManualUnpause })
  }

  function unpauseEditor() {
    console.log('EDITOR -> unpauseEditor ->')
    setPause({ isPaused: false })
    // reload page & fetch entry from server in case entry has been changed elsewhere
    // or day has changed since pause time
    // TODO make this optional?
    router.reload()
  }

  // auto pause due to page losing focus
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> isVisible ->')

    if (isVisible) {
      if (pause.isPaused && !pause.requireManualUnpause) {
        unpauseEditor()
      }
      return
    } else {
      // wait 30 seconds before requiring reload
      const timer = setTimeout(() => {
        pauseEditor(false)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])


  return { content,
           wordCount,
           lastSavedAt: lastSaved.time,
           isPaused: pause.isPaused,
           handlePause: () => {
             return pause.isPaused ? unpauseEditor() : pauseEditor() },
           handleSave,
           handleTextChange }
}
