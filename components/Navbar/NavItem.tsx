import React from 'react'
import Link from 'next/link'
import { NavLink, IconButton } from 'theme-ui'

type LinkProps = {
  title: string
  href?: string
  icon?: React.ReactNode
}

export const NavItem = (props: LinkProps) => {
  return (
    <NavLink sx={{ mx: 1,
                   display: 'flex',
                   alignItems: 'normal',
                   fontSize: 10,
                   textTransform: 'uppercase' }}>
      <IconButton sx={{ height: '1.25em',
                        width: '1.25em',
                        mr: 1,
                        p: 0 }}
                  as={ props.icon } />
      <span>{ props.title }</span>
    </NavLink>
  )
}

export const RouterNavItem = (props: LinkProps) => {
  /* console.log(props) */
  return (
    <Link href={ props.href } passHref>
      <NavItem { ...props } />
    </Link>
  )
}
