import React from 'react'
/* import { DateHeader } from './Entry/DateHeader' */
import { useEditor } from 'lib/use-editor'

export const Editor = ({ today }) => {

  const {content, wordCount, lastSavedAt, isPaused, handlePause, handleSave, handleTextChange } = useEditor({ today })

  return (
    <>
      {/* <DateHeader entry={today} /> */}
      <h1>{ new Date(today.date).toLocaleString('en-us', { timeZone: 'GMT', dateStyle: 'full' })}</h1>
      <div>
        {wordCount} {wordCount == 1 ? 'word' : 'words'}
        <button onClick={handlePause}>{ isPaused ? 'start' : 'pause' }</button>
      </div>
      saved at { new Date(lastSavedAt).toLocaleString('en-us', { timeStyle: 'short' }) }
      <div></div>
      <textarea onChange={handleTextChange} value={content} disabled={isPaused} />
      <button onClick={handleSave} disabled={isPaused}>save</button>
    </>
  )
}
