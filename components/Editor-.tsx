import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from 'urql'
import { now, getTimeSince, formatEntryDate } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import ENTRY_BY_DATE from 'queries/EntryByDate.graphql'
import CREATE_ENTRY from 'mutations/CreateEntry.graphql'
import UPDATE_ENTRY from 'mutations/UpdateEntry.graphql'
import { Flex, Box, Link, Textarea } from 'theme-ui'
import { DateHeader } from './Entry/DateHeader'
import { palettes } from 'styles/themes'
import { Entry } from 'shared/types'

export const EditorContainer = () => {
  const isVisible = usePageVisibility()
  const [pause, setPause] = useState({
    isPaused: false,
    requireManualUnpause: false
  })

  function pauseEditor(requireManualUnpause = true) {
    console.log('EDITOR -> pauseEditor ->')
    setActivity({ isActive: false, startTime: '' })
    setPause({ isPaused: true, requireManualUnpause })
  }

  function unpauseEditor() {
    console.log('EDITOR -> unpauseEditor ->')
    setPause({ isPaused: false })
  }

  function togglePause() {
    if (pause.isPaused)
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

  return (
    <>Test</>
  )
}

export const Editor = ({ user, entry }) => {
  const router = useRouter()

  const date = formatEntryDate(user)

  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [lowestWordCount, setLowestWordCount] = useState(wordCount)

  const [lastSaved, setLastSaved] = useState({
    content: '', time: '' })
  const [activity, setActivity] = useState({ isActive: false, startTime: '' })

  function initEntry(entry: Entry) {
    setContent(entry.content)
    setWordCount(entry.wordCount)
    setLastSaved({ content: entry.content, time: entry.updatedAt })
    // check activity state from shared/helpers
  }

  function handleTextChange(e) {
    let text = e.target.value
    let wc = text.split(/([\s]|[-]{2,}|[.]{3,})+/)
                 .filter(word => {
                   return word.match(/[a-zA-Z]+/)})

    if (text != content) { setContent(text) }

    if (wc.length != wordCount) {
      setWordCount(wc.length)
      if (wordCount < lowestWordCount) { setLowestWordCount(wordCount) }
    }
  }

  function handleSave() {
    console.log('EDITOR -> handleSave ->')

    if (content == lastSaved.content) return
    executeUpdate({ id: entry.id,
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


  return (
    <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      <Flex sx={{ justifyContent: 'space-between',
                  borderBottomColor: 'muted',
                  borderBottomWidth: 1,
                  borderBottomStyle: 'solid',
                  fontSize: '10px',
                  p: 1,
                  mb: 1 }}>
        <Box>
          { wordCount } { wordCount == 1 ? 'word' : 'words' }
        </Box>
        <Box>
          saved at { new Date(lastSaved.time).toLocaleString('en-us', { timeStyle: 'short'}) }
        </Box>
        </Flex>
        <Textarea
          flex={1}
          sx={{
            flex: '1',
            border: 'none',
            outline: 'none',
            resize: 'none',
            scrollbarWidth: 'thin',
            bg: isPaused ? 'muted' : 'background'
          }}
          onChange={handleTextChange}
          value={content}
          disabled={isPaused} />
        <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
          <Link onClick={handlePause} sx={{ mr: 2 }}>
            { isPaused ? 'start' : 'pause' }
          </Link>
          <Link onClick={handleSave} disabled={isPaused}>
            save
          </Link>
        </Flex>
      </Flex>
  )
}

const EditorTextArea = ({ isPaused, content, user, handleTextChange }) => {
  // TODOon load: query by today's date
  // if no entry: create on focus
  // reload this component when unpaused

  // FROM ABOVE: (page visibility/pause button) --> isPaused
  // FROM HERE: set activity
  const date = formatEntryDate(user)
  const [entry, getEntry] = useQuery(ENTRY_BY_DATE, { date })
  return (
    <Textarea
      flex={1}
      sx={{
        flex: '1',
        border: 'none',
        outline: 'none',
        resize: 'none',
        scrollbarWidth: 'thin',
        bg: isPaused ? 'muted' : 'background'
      }}
      onChange={handleTextChange}
      value={content}
      disabled={isPaused} />
  )
}
