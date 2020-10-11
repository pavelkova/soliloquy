import React, { useEffect, useState } from 'react'

export const Editor = () => {
  // get or create entry from SSR
  // entry = { content: '', activityLogs: [{ createdAt: time, updatedAt: time, content: ''}, { createdAt: time, updatedAt: time, content: ''}]}

  var date = 'October 1, 2020'

  // user preference or default: background, text color, highlight, font name, font size, timezone, word goal
  // five minutes to midnight at client time or user preference timezone, if exists

  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)

  // on text area update with space: word count
  function handleTextChange(e) {
    if (lastSaved.endTime) {
      // was more than five minutes ago
      setLastSaved()
    }


    let text = e.target.value
    let wc = text
      .split(/([\s]|[-]{2,}|[.]{3,})+/)
      .filter(word => {
        return word.match(/[a-zA-Z]+/)
      })

    setContent(text)
    setWordCount(wc.length)
  }

  const [lastSaved, setLastSaved] = useState({
    content: '',
    time: null
  })

  useEffect(() => {
    const timer = setInterval(() => {
      if (content != lastSaved.content) {
        // useMutation(UPDATE_ENTRY)
        // onSuccess
        setLastSavedContent(content)
      }
    }, 30000)
    return () => clearTimeout(timer)
    // while isActive,
    // countdown to autosave
    // autosave
    // restart countdown
  }, [content])

  return (
    <>
      <h1>{ date }</h1>
      <textarea onChange={handleTextChange}>{ content }</textarea>
      <div>{ wordCount }</div>
      <button>Save</button>
    </>
  )
}
