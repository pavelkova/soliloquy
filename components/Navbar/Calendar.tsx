import { useState, useEffect } from 'react'
import { Box, Grid, Heading, Spinner } from 'theme-ui'

type CalendarProps = {
  year: string
  month: string
  entries?: any
}

/* function lastDateOfMonth(y,m) {
 *   return new Date(y,m,0).getDate()
 * }
 * const startsOn = new Date(year, month,1).toLocaleString('en-US', { weekday: 'long' })
 *  */
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* const createWeekdayObject = arr => arr.reduce((obj, val) => { console.log(obj)
 *   console.log(val)
 *   obj[val] = [], obj }, {}) */

const createWeekdayObject = arr => arr.reduce((acc,curr)=> (acc[curr]=[],acc),{})

export const Calendar = ({ year, month, entries }) => {
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState({
    previous: createWeekdayObject(weekdays),
    current: createWeekdayObject(weekdays)
  })
  const totalDays = new Date(year, month, 0).getDate()
  const startsOn = new Date(year, month - 1, 1).getDay()
  /* const startsOn = new Date(year, month, 1).toLocaleDateString('en-US', { weekday: 'long' }) */

  useEffect(() => {
    let dayColumns = columns

    /* if (startsOn != user.settings.firstDayOfWeek) */
    if (startsOn != 0) {
      console.log('startsOn ' + startsOn)
      console.log(new Date(year, month - 1, 1).toLocaleDateString('en-US', { weekday: 'long' }))
      const daysFromPrev = 0 - startsOn
      console.log('daysFromPrev ' + daysFromPrev)
      for (var i = daysFromPrev + 1; i <= 0; i++) {
        const d = new Date(year, month - 1, i)
        const weekday = d.toLocaleDateString(
          'en-US', { weekday: 'long' })
        dayColumns.previous[weekday].push(d.getDate())
      }
    }
    for (var i = 1; i <= totalDays; i++) {
        const d = new Date(year, month - 1, i)
        const weekday = d.toLocaleDateString(
          'en-US', { weekday: 'long' })
      dayColumns.current[weekday].push(i)
    }
    setColumns(dayColumns)
    setLoading(false)
  }, [])

  if (loading) return <Spinner/>
  return (
    <Grid columns={7}>
      { weekdays.map(day => {
          return (
            <Box>
              <Heading>{ day.charAt(0) }</Heading>
              <Grid columns={1}>
                { columns.previous[day].map(date => {
                  return <Box sx={{ color: 'lightgrey' }}>
                    { date }</Box>
                }) }
                { columns.current[day].map(date => {
                    return <Box>{ date }</Box> }) }
              </Grid>
            </Box>
          ) })
      }
    </Grid>
  )
}
