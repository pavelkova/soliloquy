import React from 'react'
import { StatusBarProps } from 'shared/types/editor'
import { Flex, Box, Link, Textarea } from 'theme-ui'
import { palettes } from 'styles/themes'

export const StatusBar = (props: StatusBarProps) => {
  return (
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
        {props.wordCount} {props.wordCount == 1 ? 'word' : 'words'}
      </Box>
      {props.lastSavedAt && (
        <Box>
          saved at
          {new Date(props.lastSavedAt).toLocaleString('en-us', {
            timeStyle: 'short' })}
        </Box>
      )}
    </Flex>
  )
}
