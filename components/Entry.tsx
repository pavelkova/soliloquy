import { Box } from 'theme-ui'
import { DateHeader } from './Entry/DateHeader'

export const Entry = ({ entry }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <DateHeader date={ entry.date } />
      <Box>{ entry.content }</Box>
    </Box>
  )
}
