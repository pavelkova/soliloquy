import React, { useState } from 'react'
import { Box } from 'theme-ui'
import { BiCaretDown, BiCaretRight } from 'react-icons/bi'
import { NavItem } from './NavItem'

type DropdownProps = {
  /* openHeader: React.ReactNode
   * closedHeader: React.ReactNode */
  title: string
  children?: React.ReactNode
}

export const DropdownMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box sx={{ position: 'relative' }}>
      <Box onClick={ (e) => setIsOpen(!isOpen) }>
        { props.title } { isOpen ? <BiCaretRight /> : <BiCaretDown/> }
      </Box>

      <Box sx={{ display: isOpen ?  'initial' : 'none',
                 position: 'absolute',
                 top: '100%',
                 right: 0,
                 p: 2,
                 bg: 'muted' }}>
        { props.children }
      </Box>
    </Box>
  )
}
