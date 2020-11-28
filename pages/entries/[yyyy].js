import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import { isValid } from 'utils/date'
import ENTRIES_BY_DATES from 'queries/EntriesByDates.graphql'

export default function Year() {
  const router = useRouter()
  const { yyyy } = router.query

  if (!isValid.year(yyyy)) {
    throw new Error('Year parameter must be a valid year in 4-digit format.')
    // redirect
  }

  const fromDate = yyyy + '-01-01'
  const toDate = yyyy + '-12-31'

  const { data, fetching, error } = useQuery(ENTRIES_BY_DATES, { variables: { fromDate, toDate } })


  if (fetching) return <p>Loading...</p>
  if (error) return <p>{ error.message }</p>
  if (data) console.log(data)

  return (
  <>
    'empty'
  </>
  )
}
export const getServerSideProps = async ctx => {
  console.log('SSR ->')
  /* console.log('SSR ->')
   * console.log(ssr) */
  return { props: { ...ctx } }
}
