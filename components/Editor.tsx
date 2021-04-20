import React from 'react'
import { Flex, Box, Link, Textarea } from 'theme-ui'
import { DateHeader } from './Entry/DateHeader'
import { useEditor } from 'hooks/use-editor'
import { palettes } from 'styles/themes'

export const Editor = ({ user, entry }) => {

  const {content, wordCount, lastSavedAt, isPaused, handlePause, handleSave, handleTextChange } = useEditor({ entry })

  return (
    <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      {/* <Flex flex={1} flexDirection='column'> */}
      <Flex sx={{ justifyContent: 'space-between',
                  borderBottomColor: 'muted',
                  borderBottomWidth: 1,
                  borderBottomStyle: 'solid',
                  fontSize: '10px',
                  p: 1,
                  mb: 1 }}>
        {/* <Flex justifyContent='space-between' mb={1}> */}
        <Box>
          { wordCount } { wordCount == 1 ? 'word' : 'words' }
        </Box>
        <Box>
          saved at { new Date(lastSavedAt).toLocaleString('en-us', { timeStyle: 'short'}) }
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
