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
import { Entry, ActivityLog, ActivityState } from 'shared/types'

const PAUSE_STATES = ['unpaused', 'autopaused', 'manualpause']

const DEFAULT = {
        savedEntry: null,
        content: '',
        wordCount: 0,
        lowestWordCount: 0,
        activity: { isActive: false, startTime: null },
        pause: { isPaused: false, requireManualUnpause: false }
}

const useEditor = (props) => {
    // props.date will be an empty
    const [query, reexecuteQuery] = useQuery({
        query: ENTRY_BY_DATE,
        variables: { date:  props.date } })

    const { data, fetching, error } = query

    /**
     * Entry object  most recently received from server via query or mutation.
     */
    const [savedEntry, setSavedEntry] = useState<Entry|null>(DEFAULT.entry)
    /*
     * Current content of textarea in open client.
     */
    const [content, setContent] = useState<string>(DEFAULT.content)
    /*
     * Current word count of textarea in open client.
     */
    const [wordCount, setWordCount] = useState<number>(DEFAULT.wordCount)
    /*
     * Current content of textarea in open client.
     */
    const [activity, setActivity] = useState<ActivityState>(DEFAULT.activity)

    function initEntry(entry: Entry) {
        if (entry == savedEntry) return

        function getState(s: string) { return (entry[s] || DEFAULT[s]) }
        setContent(getState('content'))
        setWordCount(getState('wordCount'))
        setSavedEntry(getState('savedEntry'))
        setActivity(getActivityFromQuery(entry.activityLogs))
    }

    function getActivityFromQuery(logs: ActivityLog[]) {
        const recentLog = logs.slice(-1)[0]
        if (recentLog && (getTimeSince(recentLog.end) < 300000)) {
            return { isActive: true, startTime: recentLog.start }
        } else {
            return { isActive: false, startTime: '' }
        }
    }

    function handleTextChange(e) {}
    function togglePause() {}
}

/////////////////////

export const EditorContainer = ({ date }) => {
  const isVisible = usePageVisibility()
  const [savedEntry, setSavedEntry] = useState() // TODO pass these instead of entry prop
  const [pause, setPause] = useState({
    isPaused: false,
    requireManualUnpause: false
  })

  function togglePause(requireManualUnpause = false) {
    // just a precaution so that (!isPaused && requireManualUnpause) never happens
    const isManual = pause.isPaused ? false : requireManualUnpause
    setPause({ isPaused: !pause.isPaused, requireManualUnpause: isManual })
  }

  // TODO LOOKUP ENTRY function on page load, on unpause

  // auto pause due to page losing focus
  useEffect(() => {
    console.log('EDITOR -> USE EFFECT -> isVisible ->')

    if (isVisible) {
      if (!pause.requireManualUnpause && pause.isPaused) { togglePause(false) }
      return
    } else {
      // wait 30 seconds before requiring reload
      const timer = setTimeout(() => {
        togglePause(false)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <>
      <Editor entry={ entry }
              isPaused={ pause.isPaused }
              togglePause={ togglePause } />
    </>
  )
}

/////////////////////

export const Editor = ({ entry, isPaused, togglePause }) => {
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [lowestWordCount, setLowestWordCount] = useState(wordCount)
  // TODO replace lastSaved with savedEntry prop
  const [lastSaved, setLastSaved] = useState({ content: '', time: '' })
  const [activity, setActivity] = useState({ isActive: false, startTime: '' })

  function initEntry(entry: Entry) {
    setContent(entry.content)
    setWordCount(entry.wordCount)
    setLastSaved({ content: entry.content, time: entry.updatedAt })
    // check activity state from shared/helpers
  }

  // TODO if entry was passe

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

  async function updateEntry() {
    const result = await executeUpdate({ id: savedEntry.id,
                                         content,
                                         wordCount,
                                         activity: { start: activity.startTime,
                                                     lowestWordCount }})
    if (result.error) return result.error
    const data = result?.data?.updateEntry

  }
  async function createOrUpdate() {
    const data = { error: {} }
    if (savedEntry.id && (content !== savedEntry.content)) return { await executeUpdate() }
    else if (!savedEntry.id && (content !== '')) return { await executeCreate() }
    else return
  }

  function handleSave() {
    console.log('EDITOR -> handleSave ->')
    if (content == lastSaved.content) return
    // TODO if (savedEntry.id) executeUpdate, else if (content != '') executeCreate
    executeUpdate({ id: entry.id,
                    content,
                    wordCount,
                    activity: {
                      start: activity.startTime,
                      lowestWordCount
                    }
    }).then(result => {
      if (result.error) {
        togglePause(true)
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
