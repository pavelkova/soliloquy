import { Box, Text } from 'theme-ui'

export const DateHeader = ({ date }) => {
  const titleDate = new Date(date).toLocaleString('en-us', {
    timeZone: 'GMT', dateStyle: 'full' })
  return (
    <Box sx={{ mb: 1 }}>
      <Text sx={{ fontSize: [2,3,4] }}>
        {/* <Text fontSize={[2,3,4]}> */}
        { titleDate }
        </Text>
    </Box>
  )

}

/* <div>
 *     <h1>{ titleDate }</h1>
 *     <style jsx>{`
 *     h1 {
 *     font-family: Oswald;
 *     font-size: 2rem;
 *     }
 *     `}</style>
 *     </div> */
