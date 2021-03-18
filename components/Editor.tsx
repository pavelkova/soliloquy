import React from 'react'
import { Flex, Box, Link, Textarea } from 'theme-ui'
import { DateHeader } from './Entry/DateHeader'
import { useEditor } from 'hooks/use-editor'
import { palettes } from 'styles/themes'
/* import { Header } from  'components/Header' */
import { Navbar } from './Navbar'

export const Editor = ({ user, today }) => {

  const {content, wordCount, lastSavedAt, isPaused, handlePause, handleSave, handleTextChange } = useEditor({ today })

  return (
    <Flex sx={{ flex: '1', flexDirection: 'column' }}>
      {/* <Flex flex={1} flexDirection='column'> */}
      <DateHeader date={ today.date } />
      <Flex sx={{ justifyContent: 'space-between', mb: 1 }}>
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
          bg: isPaused ? 'grey' : 'white'
        }}
        onChange={handleTextChange}
        value={content}
        disabled={isPaused} />
      <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
        {/* <Flex justifyContent='flex-end' mt={1}> */}
        <Link onClick={handlePause} sx={{ mr: 2 }}>
          {/* <Link onClick={handlePause} mr={2}> */}
          { isPaused ? 'start' : 'pause' }
        </Link>
        <Link onClick={handleSave} disabled={isPaused}>
          save
        </Link>
      </Flex>
    </Flex>
  )
}

/* <style jsx>{ `
 *         body {
 *             background: ${ palettes.caramel.light }
 * min-height: 100vh;
 *         }
 * .textarea-container {
 * height: 100%;
 * }
 *         textarea {
 *             border: none;
 *             font-family: Raleway;
 * padding: 10px;
 *             width: 100%;
 *             height: 100%;
 *         }
 *         button {
 *             background: ${ palettes.caramel.light };
 *             border: 2px solid ${ palettes.caramel.bright };
 *             color: ${ palettes.caramel.brighter };
 *         }
 * .bar {
 * display: flex;
 * }
 *         .stats-bar {
 *             justify-content: space-between;
 * }
 * .button-bar {
 * justify-content: flex-end;
 * }
 * `}</style> */
