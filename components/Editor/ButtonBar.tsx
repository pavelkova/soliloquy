import React from 'react'
import { ButtonBarProps } from 'shared/types/editor'
import { Flex, Link } from 'theme-ui'
import { palettes } from 'styles/themes'

// props: { togglePause: isPaused ? setUnpaused(true) : setPaused(true) }
// props: { hasUnsavedContent: content != savedEntry.content }
export const ButtonBar = (props: ButtonBarProps) => {
  return (
    <Flex sx={{ justifyContent: 'flex-end', mt: 1 }}>
      <Link onClick={props.togglePause} sx={{ mr: 2 }}>
        {props.isPaused ? 'start' : 'pause'}
      </Link>
      <Link
        onClick={props.handleSave}
        disabled={props.isPaused || !props.hasUnsavedContent}
      >
        save
      </Link>
    </Flex>
  )
}
