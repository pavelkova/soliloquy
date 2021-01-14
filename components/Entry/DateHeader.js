export const DateHeader = ({ date }) => {
  const titleDate = new Date(date).toLocaleString('en-us', {
    timeZone: 'GMT', dateStyle: 'full' })
  return (
    <div>
      <h1>{ titleDate }</h1>
      <style jsx>{`
h1 {
font-family: Oswald;
font-size: 2rem;
}
        `}</style>
    </div>
  )

}
