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
      <div className='bar stats-bar'>
        <span>{wordCount} {wordCount == 1 ? 'word' : 'words'}</span>
        <span>
          saved at { new Date(lastSavedAt).toLocaleString('en-us', { timeStyle: 'short' }) }
        </span>

      </div>
      <div className='textarea-container'>
        <textarea onChange={handleTextChange} value={content} disabled={isPaused} />
      </div>
      <div className='bar button-bar'>
        <button onClick={handlePause}>{ isPaused ? 'start' : 'pause' }</button>
        <button onClick={handleSave} disabled={isPaused}>save</button>
      </div>
      <style jsx>{ `
        body {
            background: ${ palettes.caramel.light }
min-height: 100vh;
        }
.textarea-container {
height: 100%;
}
        textarea {
            border: none;
            font-family: Raleway;
padding: 10px;
            width: 100%;
            height: 100%;
        }
        button {
            background: ${ palettes.caramel.light };
            border: 2px solid ${ palettes.caramel.bright };
            color: ${ palettes.caramel.brighter };
        }
.bar {
display: flex;
}
        .stats-bar {
            justify-content: space-between;
}
.button-bar {
justify-content: flex-end;
}
        `}</style>
    </>
  )
}
