import { Divider } from 'theme-ui'
import { AiOutlineGithub, AiOutlineUser } from 'react-icons/ai'
import { DropdownMenu } from './Navbar/Dropdown'
import { NavItem, RouterNavItem } from './Navbar/NavItem'

const menus = {
  site: {
    home: { href: '/', title: 'Home' },
    about: { href: '/about', title: 'About' }
  },
  auth: {
    login: { href: '/login', title: 'Login' },
    signup: { href: '/signup', title: 'Signup' }
  },
  app: {
    today: { href: '/today', title: 'Today' },
    entries: { href: '/entries', title: 'Entries', children: {
      all: { href: '/entries', title: 'All' }
    }},
    user: { title: 'User', children: {
      dashboard: { href: '/account/dashboard', title: 'Dashboard' },
      settings: { href: '/account/settings', title: 'Settings' },
      /* divider: Divider, */
      logout: { href: '/logout', title: 'Logout' }
    }}
  },
  entry: {},
  footer: {
    privacy: { href: '/privacy-policy', title: 'Privacy policy' },
    github: { href: 'https://github.com/pavelkova/soliloquy',
              title: 'Github', icon: AiOutlineGithub },
    developer: { href: 'https://egpavelka.com', title: 'Developer' }
  }
}

const UserFooterMenu = { ...menus.site, ...menus.footer }

const createBigMenu = items => Object.values(items).map(item => {
  const Item = item['href'] ? <RouterNavItem {...item} /> : <NavItem {...item} />

})

const createMenu = items => Object.values(items).map(item => {
    return <RouterNavItem {...item} />
})

const createDropdown = (title, items) => {
  return (
    <DropdownMenu title={ title }>
      { Object.values(items).map(item => {
          return <RouterNavItem {...item} /> }) }
    </DropdownMenu>
  )
}
