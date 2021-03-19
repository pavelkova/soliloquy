import React, { useState } from 'react'
import Link from 'next/link'
import { Alert, Box, Close, Divider, Flex, Heading, NavLink, Styled } from 'theme-ui'


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

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Box onClick={ (e) => setIsOpen(!isOpen) }>
        X
      </Box>

        <Box sx={{ position: 'absolute',
                   display: isOpen ?  'initial' : 'none',
                   right: 2,
                   bg: 'muted',
                   mt: 3 }}>
          <EntryMenu />
          <UserMenu />
        </Box>
    </>
  )
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Box onClick={ (e) => setIsOpen(!isOpen) }>
        sidebar
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
        <Close onClick={ (e) => setIsOpen(!isOpen) } />
        <EntryMenu/>
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
      <Flex>
        <StyledLink href='/today' title='Today' />
        <StyledLink href='/entries' title='Entries' />
        <StyledLink href='/account/settings' title='Profile' />
        <DropdownMenu />
        <Sidebar />
      </Flex>
    </Flex>
  )
}
