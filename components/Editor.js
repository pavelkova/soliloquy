import React, { useEffect, useState } from 'react'
import { DateHeader } from './Entry/DateHeader'
import { useEditor } from 'lib/use-editor'

export const Editor = ({ today }) => {

  const {content, wordCount, lastSavedAt, isPaused, handleSave, handleTextChange, handlePause } = useEditor({ today })

  return (
    <>
      <DateHeader entry={today} />
      <div>
        {wordCount} {wordCount == 1 ? 'word' : 'words'}
        {/* <button onClick={ setIsPaused(!isPaused)}>{ isPaused ? 'start' : 'pause' }</button> */}
      </div>
      saved at { lastSavedAt.toLocaleString('en-us', { timeStyle: 'short' }) }
      <div></div>
      <textarea onChange={handleTextChange} value={content} disabled={isPaused} />
      <button onClick={handleSave} disabled={isPaused}>save</button>
    </>
  )
}
