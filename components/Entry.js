import { DateHeader } from './Entry/DateHeader'

export const Entry = ({ entry }) => {
  return (
    <>
      <DateHeader date={ entry.date } />
      <div>{ entry.content }</div>
    </>
  )
}
