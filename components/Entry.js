import { Box } from 'rebass'
import { DateHeader } from './Entry/DateHeader'

export const Entry = ({ entry }) => {
  return (
    <Box mb={2}>
      <DateHeader date={ entry.date } />
      <Box>{ entry.content }</Box>
    </Box>
  )
}
