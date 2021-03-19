import { Box, Heading } from 'theme-ui'

export const DateHeader = ({ date }) => {
  const titleDate = new Date(date).toLocaleString(
    'en-us', { timeZone: 'GMT',
               dateStyle: 'full' })
  return (
    <Box sx={{ mb: 1 }}>
      <Heading>
        { titleDate }
        </Heading>
    </Box>
  )

}
