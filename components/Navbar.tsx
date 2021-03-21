import React, { useState } from 'react'
import Link from 'next/link'
import { jsx, Alert, Box, Close, Divider, Flex, Heading, MenuButton, NavLink, Styled } from 'theme-ui'
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser } from 'react-icons/ai'

const EntryMenu = () => {
  return (
    <>
      <StyledLink href='/entries' title='Entries' />
      <Box>
        <NavLink>By year</NavLink>
        <ul>
          <li><NavLink>2021</NavLink></li>
          <ul>
            <li><NavLink>January</NavLink></li>
          </ul>
        </ul>
      </Box>
    </>
  )
}

const UserMenu = () => {
  return (
    <>
      <NavLink>Profile</NavLink>
      <NavLink>Settings</NavLink>
      <Divider />
      <NavLink>Logout</NavLink>
    </>
  )
}

const UserlessMenu = () => {
  return (
    <>
      <NavLink>Login</NavLink>
      <NavLink>Signup</NavLink>
    </>
  )
}

/* props: open heading, closed heading, child menu  */

const DropdownerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
      <Box sx={{ position: 'relative' }}>
        <Box onClick={ (e) => setIsOpen(!isOpen) }>
          { isOpen ? <AiOutlineClose/> : <AiOutlineMenu/> }
      </Box>

      <Box sx={{ display: isOpen ?  'initial' : 'none',
                 position: 'absolute',
                 top: '100%',
                 right: 0,
                 pl: 2,
                 bg: 'muted' }}>
          <EntryMenu />
        <UserMenu />
      </Box>
    </Box>
  )
}

/* type DropdownProps = {
  *   openHeader: React.ReactNode
  *   closedHeader: React.ReactNode
  *   children?: React.ReactNode
  * } */

const DropdownMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box sx={{ position: 'relative' }}>
      <Box onClick={ (e) => setIsOpen(!isOpen) }>
        { isOpen ? '- ' : '+ ' } { props.title }
      </Box>

      <Box sx={{ display: isOpen ?  'initial' : 'none',
                 position: 'absolute',
                 top: '100%',
                 right: 0,
                 pl: 2,
                 bg: 'muted' }}>
        { props.children }
      </Box>
    </Box>
  )
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Box onClick={ (e) => setIsOpen(!isOpen) }>
        { isOpen ? <AiOutlineClose/> : <AiOutlineMenu/> }
        <MenuButton />
      </Box>
      <Box sx={{ position: 'absolute',
                 display: isOpen ? 'initial' : 'none',
                 height: '100vh',
                 bg: 'muted',
                 zIndex: 1,
                 right: 0,
                 top: 0,
                 bottom: 0,
                 minWidth: '30vw',
                 p: 3 }}>
        
        <Box onClick={ (e) => setIsOpen(!isOpen) }>
          <MenuButton />
        </Box>
        <EntryMenu/>
        <DropdownMenu />
        <UserMenu/>
      </Box>
    </>
  )
}

type LinkProps = {
  title: string,
  href: string
}

const StyledLink = (props: LinkProps) => {
  return (
    <Link href={ props.href } passHref>
      <NavLink sx={{ mr: 2, fontSize: 10, textTransform: 'uppercase' }}>
        { props.title }
      </NavLink>
    </Link>
  )
}

export const Navbar = () => {
  return (
    <Flex
      sx={{ justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 2 }}>
      <Heading
        sx={{ fontFamily: 'logo',
              fontWeight: 'heading',
              fontSize: 32,
              fontStyle: 'italic',
              color: 'accent' }}>
        soliloquy
      </Heading>
      <Flex sx={{ alignItems: 'baseline' }}>
        <DropdownMenu title='entries'>
          <UserMenu/>
        </DropdownMenu>
        <StyledLink href='/today' title='Today' />
        <StyledLink href='/entries' title='Entries' />
        <StyledLink href='/account/settings' title='Profile' />
        <Sidebar />
      </Flex>
    </Flex>
  )
}
