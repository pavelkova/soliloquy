import React from 'react'
import { Box, Flex, Heading } from 'theme-ui'
import { AiOutlineUser } from 'react-icons/ai'
import { DropdownMenu } from './Navbar/Dropdown'
import { NavItem, RouterNavItem } from './Navbar/NavItem'

const SiteMenu = {
  home: { href: '/', title: 'Home' },
  about: { href: '/about', title: 'About' }
}

const AppMenu = {
  today: { href: '/today', title: 'Today' },
  entries: { href: '/entries', title: 'Entries' }
}

const FooterMenu = {
  privacy: { href: '/privacy-policy', title: 'Privacy policy' },
  github: { href: 'https://github.com/pavelkova/soliloquy', title: 'Github' },
  developer: { href: 'https://egpavelka.com', title: 'Developer' }
}

const userMenu = {
  dashboard: { href: '/account/dashboard', title: 'Dashboard', icon: AiOutlineUser },
  settings: { href: '/account/settings', title: 'Settings' },
  logout: { href: '/logout', title: 'Logout' },
}

const loginMenu = {
  login: { href: '/login', title: 'Login' },
  signup: { href: '/signup', title: 'Signup' }
}

const createMenu = items => Object.values(items).map(item => {
    return <RouterNavItem {...item} />
})

const createDropdown = (title, items) => {
  return (
    <DropdownMenu title={ title }>
      { Object.values(items).map(item => {
          return <RouterNavItem key={ item.title } {...item} /> }) }
    </DropdownMenu>
  )
}

export const Navbar = () => {
  const UserMenu = createDropdown('User', userMenu)
  const LoginMenu = createMenu(loginMenu)

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
        { LoginMenu }
        { UserMenu }
      </Flex>
    </Flex>
  )
}
