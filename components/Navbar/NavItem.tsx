import React from 'react'
import Link from 'next/link'
import { NavLink, Icon } from 'theme-ui'

type LinkProps = {
  title: string,
  href?: string,
  icon?: React.ReactNode
}

export const NavItem = (props: LinkProps) => {
  return (
    <NavLink sx={{ mr: 2,
                   fontSize: 10,
                   textTransform: 'uppercase' }}>
      { props.icon }
      { props.title }
    </NavLink>
  )
}

export const RouterNavItem = (props: LinkProps) => {
  return (
    <Link href={ props.href } passHref>
      <NavItem { ...props } />
    </Link>
  )
}
