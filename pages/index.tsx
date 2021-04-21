import { useState } from 'react'

  /* const [contentState, setContent] = useState('')
   * const [wordCountState, setWordCount] = useState(0)
   * const [lowestWordCountState, setLowestWordCount] = useState(wordCount)

   * const [lastSavedState, setLastSaved] = useState({
   *   content: '', time: '' })
   * const [activityState, setActivity] = useState({ isActive: false, startTime: '' })
   * const [pauseState, setPause] = useState({
   *   isPaused: false,
   *   requireManualUnpause: false
   * }) */

function useEditorState() {
    const content = useState('')
    const wordCount = useState(0)
    const lowestWordCount = useState(wordCount)
    const lastSaved = useState({
      content: '', time: '' })
    const activityState = useState({
      isActive: false, startTime: '' })
    const pause = useState({
      isPaused: false,
      requireManualUnpause: false
    })

  function stateObject(s) {
    console.log(s[0])
    console.log(s[1])
      return { state: s[0], set: () => s[1] }
    }

    return {
      content: stateObject(content),
      wordCount: stateObject(wordCount),
      lowestWordCount: stateObject(lowestWordCount),
      lastSaved: stateObject(lastSaved),
      activityState: stateObject(activityState),
      pause: stateObject(pause),
    }
}

export default function Index() {
  const testy = useEditorState()
  console.log(testy.content)
  console.log(testy.content.set('new thang'))
  console.log(testy)
  return (
    <>
      <p>ayyy</p>
    </>
  )
}
