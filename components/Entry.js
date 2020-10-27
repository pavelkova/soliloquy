import { useQuery } from 'urql'
import { DateHeader } from './Entry/DateHeader'
export const Entry = ({entry}) => {
  return (
    <DateHeader entry={entry} />
  )
}
