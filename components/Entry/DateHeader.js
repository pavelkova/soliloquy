export const DateHeader = ({ date }) => {
  const titleDate = new Date(date).toLocaleString('en-us', {
    timeZone: 'GMT', dateStyle: 'full' })
  return (
    <div>
      <h1>{ titleDate }</h1>
    </div>
  )

}
