import { useRouter } from 'next/router'
import { clientWithAuth } from 'lib/ssr/client-with-auth'
import { isValid } from 'utils/date'
import ENTRIES_BY_DATES from 'queries/EntriesByDates.graphql'
import { Entry } from 'components/Entry'
import { Calendar } from 'components/Navbar/Calendar'

export default function Month({ user, entries }) {
  const router = useRouter()
  const { yyyy, mm } = router.query
  console.log(yyyy)
  if (!entries || entries.length == 0) return (
    <>
      <Calendar year={ yyyy } month={ mm } entries={ entries } />
      <div>No entries in this month.</div>
    </>
  )

  return (
    <>
    <Calendar year={ yyyy } month={ mm } entries={ entries } />
    { entries.map(entry =>
      <div key={ entry.id }>
        <Entry entry={ entry } />
      </div>
    ) }
    </>
  )
}

export const getServerSideProps = async ctx => {
  console.log('SSR ->')
  const { props, client } = await clientWithAuth(ctx)

  const { yyyy, mm } = ctx.params
  if (!isValid.year(yyyy) || !isValid.month(mm)) return

  const lastDayOfMonth = (y,m) => {
    return new Date(yyyy, mm, 0).getDate()
  }
  const fromDate = yyyy + '-' + mm + '-01'
  const toDate = yyyy + '-' + mm + '-' + lastDayOfMonth(yyyy,mm)

  const result = await client.query(ENTRIES_BY_DATES, {
    dateSpan: { fromDate, toDate } }).toPromise()

  const entries = result?.data?.findEntriesByDates
  console.log(entries)
  props.entries = entries

  return { props }
}
