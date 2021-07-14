import React from 'react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { now, getTimeSince, formatEntryDate } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import ENTRY_BY_DATE from 'queries/EntryByDate.graphql'
import CREATE_OR_UPDATE_ENTRY from 'mutations/CreateOrUpdateEntry.graphql'
import { Entry, ActivityLog } from 'shared/types'
import { EntryInput, ActivityState, PauseState } from 'shared/types/editor'

import { Box, Flex, Link, Textarea } from 'theme-ui'

const DEFAULT = {
  savedEntry: null,
  content: '',
  wordCount: 0,
  activity: { isActive: false, start: null },
  currentLog: null,
  // activity: { logId: number, start: Date }
  // currentLog: { activityLog }
  pause: { isPaused: false, requireManualUnpause: false, pausedMessage: '' },
}

export const EditorContainer = ({ date, timezone }) => {
  const isVisible = usePageVisibility()
  const [savedEntry, setSavedEntry] = useState<Entry | null>(DEFAULT.savedEntry)
  const [pause, setPause] = useState<PauseState>(DEFAULT.pause)
  console.log(date)
  console.log(timezone)
  // Query for existing entry on editor load
  const [query, reexecuteQuery] = useQuery({
    query: ENTRY_BY_DATE,
    variables: { date },
  })
  const { data, fetching, error } = query

  useEffect(() => {
    console.log('EDITOR CONTAINER -> USE EFFECT: [data] (getEntryByDate query)')
    console.log(data)

    if (data?.findEntryByDate && data.findEntryByDate != savedEntry) {
      setSavedEntry(data.findEntryByDate)
    }
  }, [data])

  function setPaused(requireManualUnpause = false, pausedMessage = '') {
    setPause({ isPaused: true, requireManualUnpause, pausedMessage })
  }
  function setUnpaused(isManual = false) {
    console.log(pause)
    if (pause.requireManualUnpause && !isManual) return
    reexecuteQuery()
    setPause(DEFAULT.pause)
  }

  // When PAGE VISIBILITY changes:
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> isVisible ->')
    if (isVisible) {
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

  return (
    <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      {error && <p>ERROR</p>}
      {fetching && <p>Loading...</p>}
      {data && (
        <Editor
          date={date}
          timezone={timezone}
          savedEntry={savedEntry}
          setSavedEntry={setSavedEntry}
          isPaused={pause.isPaused}
          pause={setPaused}
          unpause={setUnpaused}
        />
      )}
    </Flex>
  )
}

export const Editor = ({
  date,
  timezone,
  savedEntry,
  setSavedEntry,
  isPaused,
  pause,
  unpause,
}) => {
  const [content, setContent] = useState<string>(
    savedEntry?.content || DEFAULT.content
  )
  const [currentLog, setCurrentLog] = useState<ActivityLog>(
    savedEntry?.logs?.[-1] || DEFAULT.currentLog
  )
  const [wordCount, setWordCount] = useState<number>(
    savedEntry?.wordCount || DEFAULT.wordCount
  )
  const [lowestWordCount, setLowestWordCount] = useState<number>(wordCount)
  const [activity, setActivity] = useState<ActivityState>(DEFAULT.activity)

  // Set local states from server response to queries and mutations
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT [savedEntry]')
    if (savedEntry == DEFAULT.savedEntry) return
    if (!activity.isActive) {
      getActivityFromLogs(savedEntry.activityLogs)
      if (savedEntry.content != content) {
        setContent(savedEntry.content)
      }
      if (savedEntry.wordCount != wordCount) {
        setWordCount(savedEntry.wordCount)
      }
    }
    return () => {}
  }, [savedEntry])

  // Set local activity-related states from entry activity logs
  function getActivityFromLogs(logs: ActivityLog[]) {
    const recentLog = logs?.slice(-1)[0]
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
      if (!activity.isActive) {
        setActive(new Date())
      }
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
  const saveDisabled = isPaused || content == savedEntry?.content
  function handleSave() {
    console.log('EDITOR -> HANDLE SAVE ->')
    if (
      (!savedEntry?.id && content.length == 0) ||
      content == savedEntry?.content
    )
      return

    console.log('-> CONTINUE SAVE ->')
    executeMutation({
      date,
      timezone,
      content,
      wordCount,
      lowestWordCount,
      start: activity.start,
    }).then((result) => {
      if (result.error) {
        console.error(result.error)
        return result.error
      }
      const entry = result?.data?.createOrUpdateEntry
      if (entry) {
        setSavedEntry(entry)
      }
      return entry
    })
  }

  // Pause & activity helpers
  function setInactive() {
    setActivity(DEFAULT.activity)
    setLowestWordCount(wordCount)
  }

  function setActive(start: Date) {
    console.log('EDITOR -> setActive ->')
    setActivity({ isActive: true, start })
    console.log(activity)
  }

  function toggleManualPause() {
    isPaused ? unpause(true) : pause(true)
  }

  // When CONTENT changes: start timers for autosave and autopause
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> content ->')
    const autoSaveTimer = setTimeout(() => {
      handleSave()
    }, 3000)
    const autoPauseTimer = setTimeout(() => {
      pause(true, 'Your session has been paused due to inactivity.')
    }, 300000)
    return () => {
      clearTimeout(autoSaveTimer)
      clearTimeout(autoPauseTimer)
    }
  }, [content])

  return (
    <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      <>
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
            bg: isPaused ? 'muted' : 'background',
          }}
          value={content}
          onChange={handleTextChange}
          disabled={isPaused}
        />
        <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
          <Link onClick={toggleManualPause} sx={{ mr: 2 }}>
            {isPaused ? 'start' : 'pause'}
          </Link>
          <Link onClick={handleSave} disabled={saveDisabled}>
            save
          </Link>
        </Flex>
      </>
    </Flex>
  )
}
