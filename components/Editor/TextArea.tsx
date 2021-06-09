import React from 'react'
import { TextAreaProps } from 'shared/types/editor'
import { Textarea } from 'theme-ui'
import { palettes } from 'styles/themes'

export const TextArea = (props: TextAreaProps) => {
  return (
    <Textarea
      flex={1}
      sx={{
        flex: '1',
        border: 'none',
        outline: 'none',
        resize: 'none',
        scrollbarWidth: 'thin',
        bg: props.isPaused ? 'muted' : 'background',
      }}
      onChange={props.handleChange}
      value={props.content}
      disabled={props.isPaused}
    />
  )
}
