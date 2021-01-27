import React from 'react'
import { DateHeader } from './Entry/DateHeader'
import { useEditor } from 'hooks/use-editor'
import { palettes } from 'styles/themes'
import { Header } from  'components/Header'

export const Editor = ({ user, today }) => {

  const {content, wordCount, lastSavedAt, isPaused, handlePause, handleSave, handleTextChange } = useEditor({ today })

  return (
    <>
      <Header />
      <DateHeader date={ today.date } />
      <div className='stats-bar'>
        <span>{wordCount} {wordCount == 1 ? 'word' : 'words'}</span>
        <span>
          saved at { new Date(lastSavedAt).toLocaleString('en-us', { timeStyle: 'short' }) }
        </span>

      </div>
      <textarea onChange={handleTextChange} value={content} disabled={isPaused} />
      <button onClick={handlePause}>{ isPaused ? 'start' : 'pause' }</button>
      <button onClick={handleSave} disabled={isPaused}>save</button>

      <style jsx>{ `
        body {
            background: ${ palettes.caramel.light }
        }
        textarea {
            border: 1px solid black;
            font-family: Raleway;
            resize: none;
            width: 100%;
            height: 100%;
        }
        button {
            background: ${ palettes.caramel.light };
            border: 2px solid ${ palettes.caramel.bright };
            color: ${ palettes.caramel.brighter };
        }
        .stats-bar {
            display: flex;
            justify-content: space-between;
}
        `}</style>
    </>
  )
}
