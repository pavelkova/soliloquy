import { Flex, Heading, Box, Link } from 'rebass'

export const Navbar = () => {
  return (
    <Flex justifyContent='space-between' alignItems='baseline' mb={2}>
      <Heading>soliloquy</Heading>
      <Flex>
        <Link mr={2}>Today</Link>
        <Link mr={2}>Entries</Link>
        <Link>Profile</Link>
      </Flex>
    </Flex>
  )
}
