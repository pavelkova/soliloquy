import { Flex, Heading, Box, NavLink } from 'theme-ui'
import Link from 'next/link'

const Dropdown = props =>
  <Box/>

export const Navbar = () => {
  return (
    <Flex sx={{ justifyContent: 'space-between',
                alignItems: 'baseline',
                mb: 2 }}>
      {/* <Flex justifyContent='space-between' alignItems='baseline' mb={2}> */}
      <Heading>soliloquy</Heading>
      <Flex>
        {/* <NavLink mr={2}> */}
        <NavLink sx={{ mr: 2 }}>
          <Link href='/today'>
            Today
          </Link>
        </NavLink>
        {/* <NavLink mr={2}> */}
        <NavLink sx={{ mr: 2 }}>
          <Link href='/entries'>
            Entries
          </Link>
        </NavLink>
        <NavLink sx={{ mr: 2 }}>
          <Link href='/account/profile'>
            Profile
          </Link>
        </NavLink>
      </Flex>
    </Flex>
  )
}
