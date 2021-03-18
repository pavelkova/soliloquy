import { Flex, Text, Box, Link } from 'theme-ui'

export default function Index() {

  return (
    <>
      <Flex
        px={2}
        color='white'
        bg='black'
        alignItems='center'>
        <Text p={2} fontWeight='bold'>Soliloquy</Text>
        <Box mx='auto' />
        <Link variant='nav' href='#!'>
          Profile
        </Link>
      </Flex>
    </>
  )
}
