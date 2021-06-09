import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { now, getTimeSince, formatEntryDate } from 'utils/date'
import { usePageVisibility } from 'utils/visibility'
import { Flex, Box, Link, Textarea } from 'theme-ui'
import { DateHeader } from './Entry/DateHeader'
import { palettes } from 'styles/themes'
import { Entry, ActivityLog, ActivityState, PauseState } from 'shared/types'
import { EntryInput } from 'shared/types/editor'


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

    if (entry.content != content) {
      setContent(entry.content)
    }
    if (entry.wordCount != wordCount) {
      setWordCount(entry.wordCount)
    }

    activity.isInactive ?? getActivityFromLogs(entry.activityLogs)
  }

  // Set local activity-related states from entry activity logs
  function getActivityFromLogs(logs: ActivityLog[]) {
    const recentLog = logs.slice(-1)[0]
    if (recentLog && getTimeSince(recentLog.end) < 300000) {
      setActive(recentLog.startTime)
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
      setContent(content)
      !activity.isActive ?? setActive(now())
      if (wc.length != wordCount) {
        setWordCount(wc.length)(wordCount < lowestWordCount) ??
          setLowestWordCount(wordCount)
      }
    }
  }

  // Run create or update entry mutation from local states
  function handleSave() {
    const args: EntryInput = {
      content,
      wordCount,
      lowestWordCount,
      startTime: activity.startTime,
    }

    const { mutation, variables } = savedEntry?.id
      ? { mutation: updateEntry, variables: { id: savedEntry.id, ...args } }
      : {
          mutation: createEntry,
          variables: { date: props.date, timezone: props.timezone, ...args },
        }

    const [mutationResult, executeMutation] = useMutation(mutation)
    executeMutation(variables).then((result) => {
      if (result.error) {
        console.error(result.error)
        return result.error
      }
      const data = result?.data?.[mutation]
      if (data) {
        syncEditorState(data)
      }
      return data
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

  // function togglePause(requireManualUnpause = false) {
  //     setPause({isPaused: !pause.isPaused, requireManualUnpause })
  // }

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
        <Box>
          saved at{' '}
          {new Date(savedEntry.updated_at).toLocaleString('en-us', {
            timeStyle: 'short',
          })}
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
          bg: isPaused ? 'muted' : 'background',
        }}
        onChange={handleTextChange}
        value={content}
        disabled={isPaused}
      />
      <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
        <Link onClick={handlePause} sx={{ mr: 2 }}>
          {isPaused ? 'start' : 'pause'}
        </Link>
        <Link onClick={handleSave} disabled={isPaused}>
          save
        </Link>
      </Flex>
    </Flex>
  )
}
