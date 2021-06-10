import React from 'react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { now, getTimeSince, formatEntryDate } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import ENTRY_BY_DATE from 'queries/EntryByDate.graphql'
import CREATE_OR_UPDATE_ENTRY from 'mutations/CreateOrUpdateEntry.graphql'
// import { CREATE_ENTRY as createEntry } from 'mutations/CreateEntry.graphql'
// import { UPDATE_ENTRY as updateEntry } from 'mutations/UpdateEntry.graphql'
import { Entry, ActivityLog } from 'shared/types'
import { EditorInput, ActivityState, PauseState } from 'shared/types/editor'

import { Box, Flex, Link, Textarea } from 'theme-ui'

const DEFAULT = {
  savedEntry: null,
  content: '',
  wordCount: 0,
  activity: { isActive: false, startTime: null },
  pause: { isPaused: false, requireManualUnpause: false, pausedMessage: '' },
}

export const Editor = (props) => {
  const isVisible = usePageVisibility()
  const [savedEntry, setSavedEntry] = useState<Entry | null>(DEFAULT.entry)
  const [content, setContent] = useState<string>(DEFAULT.content)
  const [wordCount, setWordCount] = useState<number>(DEFAULT.wordCount)
  const [lowestWordCount, setLowestWordCount] = useState<number>(wordCount)
  const [activity, setActivity] = useState<ActivityState>(DEFAULT.activity)
  const [pause, setPause] = useState<PauseState>(DEFAULT.pause)

  // Query for existing entry on editor load
  const [query, reexecuteQuery] = useQuery({
    query: ENTRY_BY_DATE,
    variables: { date: props.date },
  })
  const { data, fetching, error } = query

  // Set local states from server response to queries and mutations
  function syncEditorState(entry?: Entry) {
    if (entry == savedEntry) return

    setSavedEntry(entry)
      console.log(entry)

    if (entry && !activity.isActive) {
      getActivityFromLogs(entry.activityLogs)
      if (entry.content != content) {
        setContent(entry.content)
      }
      if (entry.wordCount != wordCount) {
        setWordCount(entry.wordCount)
      }
    }
  }

  // Set local activity-related states from entry activity logs
  function getActivityFromLogs(logs: ActivityLog[]) {
    const recentLog = logs.slice(-1)[0]
    if (recentLog && getTimeSince(recentLog.end) < 300000) {
      setActive(recentLog.start)
      const lwc =
        recentLog.lowestWordCount < wordCount
          ? recentLog.lowestWordCount
          : wordCount
      setLowestWordCount(lwc)
    } else {
      setInactive()
    }
  }

  // Set local states from client when textarea changes
  function handleTextChange(e) {
    const text = e.target.value
    const wc = text.split(/([\s]|[-]{2,}|[.]{3,})+/).filter((word) => {
      return word.match(/[a-zA-Z]+/)
    })

    if (text != content) {
      setContent(text)
      if (!activity.isActive) { setActive(new Date()) }
      if (wc.length != wordCount) {
        setWordCount(wc.length)
        if (wordCount < lowestWordCount) {
          setLowestWordCount(wordCount)
        }
      }
    }
  }

  // Run create or update entry mutation from local states
  const [mutationResult, executeMutation] = useMutation(CREATE_OR_UPDATE_ENTRY)
  function handleSave() {
    console.log('HANDLE SAVE')
    console.log('savedEntry')
    console.log(savedEntry)
    if (!savedEntry?.id && content.length == 0) return
    console.log('passed the vibe check')
    const args = {
      content,
      wordCount,
      lowestWordCount,
      start: activity.startTime,
    }

    const variables: EditorInput = savedEntry?.id
      ? { id: savedEntry.id, ...args }
      : { date: props.date, timezone: props.timezone, ...args }

    executeMutation(variables).then((result) => {
      if (result.error) {
        console.error(result.error)
        return result.error
      }
      const res = result?.data?.createOrUpdateEntry
      if (res) {
        syncEditorState(res)
      }
      return res
    })
  }

  // Pause & activity helpers
  function setInactive() {
    setActivity(DEFAULT.activity)
    setLowestWordCount(wordCount)
  }

  function setActive(startTime: Date) {
    setActivity({ isActive: true, startTime })
  }

  function setPaused(requireManualUnpause = false, pausedMessage = '') {
    setPause({ isPaused: true, requireManualUnpause, pausedMessage })
  }
  function setUnpaused(isManual = false) {
    if (pause.requireManualUnpause && !isManual) return
    setPause(DEFAULT.pause)
  }

  function toggleManualPause() {
    pause.isPaused ? setUnpaused(true) : setPaused(true)
  }

  // When CONTENT changes: start timers for autosave and autopause
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> content ->')
    const autoSaveTimer = setTimeout(() => {
      handleSave()
    }, 3000)
    const autoPauseTimer = setTimeout(() => {
      setPaused({
        isPaused: true,
        requireManualUnpause: true,
        pausedMessage: 'Your session has been paused due to inactivity.',
      })
    }, 300000)
    return () => {
      clearTimeout(autoSaveTimer)
      clearTimeout(autoPauseTimer)
    }
  }, [content])

    useEffect(() => {
        syncEditorState(data)
    }, [data])

  // When PAGE VISIBILITY changes:
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> isVisible ->')
    if (isVisible) {
      // if (!pause.requireManualUnpause && pause.isPaused) { togglePause(false) }
      if (!pause.requireManualUnpause && pause.isPaused) {
        setUnpaused(false)
      }
    } else {
      // wait 30 seconds before requiring reload
      const timer = setTimeout(() => {
        setPaused(false)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  /*
       <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      <Header />
      <StatusBar wordCount={wordCount} lastSavedAt={savedEntry?.updatedAt} />
      <TextArea
        content={content}
        isPaused={pause.isPaused}
        onChange={handleTextChange}
      />
      <ButtonBar
        isPaused={pause.isPaused}
        togglePause={toggleManualPause}
        hasUnsavedContent={content != savedEntry?.content}
        handleSave={handleSave}
      />
      </Flex>
    */

  return (
    <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      <Flex
        sx={{
          justifyContent: 'space-between',
          borderBottomColor: 'muted',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          fontSize: '10px',
          p: 1,
          mb: 1,
        }}
      >
        <Box>
          {wordCount} {wordCount == 1 ? 'word' : 'words'}
        </Box>
        {savedEntry?.updatedAt && (
          <Box>
            saved at
            {new Date(savedEntry.updatedAt).toLocaleString('en-us', {
              timeStyle: 'short',
            })}
          </Box>
        )}
      </Flex>
      <Textarea
        flex={1}
        sx={{
          flex: '1',
          border: 'none',
          outline: 'none',
          resize: 'none',
          scrollbarWidth: 'thin',
          bg: pause.isPaused ? 'muted' : 'background',
        }}
      value={content}
      onChange={handleTextChange}
        disabled={pause.isPaused}
      />
      <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
        <Link onClick={toggleManualPause} sx={{ mr: 2 }}>
          {pause.isPaused ? 'start' : 'pause'}
        </Link>
        <Link
          onClick={handleSave}
          disabled={pause.isPaused || content == savedEntry?.content}
        >
          save
        </Link>
      </Flex>
    </Flex>
  )
}
