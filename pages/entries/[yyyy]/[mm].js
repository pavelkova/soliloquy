import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import { isValid } from 'utils/date'
import ENTRIES_BY_DATES from 'queries/EntriesByDates.graphql'

export default function Month() {
  const router = useRouter()
  const { yyyy, mm } = router.query
console.log(router)
  if (!isValid.year(yyyy)) {
    throw new Error('Year parameter must be a valid year in 4-digit format.')
    // redirect
  }

  if (!isValid.month(mm)) {
    throw new Error('Month must be a number between 1 and 12, corresponding with a calendar month.')
  }

  let lastDayOfMonth = '31'

  /* Thirty days hath September,
     April, June and November.
     All the rest have thirty-one,
     Excepting February alone,
     And that has twenty-eight days clear
     And twenty-nine in each leap year. */

  if (parseInt(mm) == 2) {
    Number.isInteger(parseInt(yyyy)/4) ? lastDayOfMonth = '29' : lastDayOfMonth = '28'
  } else if ([4, 6, 9, 11].includes(parseInt(mm))) {
    lastDayOfMonth = '30'
  }

  const fromDate = yyyy + '-' + mm + '-01'
  const toDate = yyyy + '-' + mm + '-' + lastDayOfMonth

  const [{ data, fetching, error }] = useQuery({
    query: ENTRIES_BY_DATES,
    variables: { fromDate, toDate },
  })

  if (fetching) return <p>Loading...</p>
  if (error) return <p>{ error.message }</p>
  if (data) console.log(data)

  return (
  <>
    'empty'
  </>
  )
}
