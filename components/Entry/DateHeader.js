import { formatWithLocale } from 'utils/date'

export const DateHeader = ({ entry }) => {
  // FIXME date function
  const titleDate = formatWithLocale(entry.user, { dateStyle: 'long' })
  console.log(entry)
  return (
    <div>
      <h1>{ titleDate }</h1>
    </div>
  )

}
