import { ssrRequireAuth } from 'lib/ssr-auth'
import { isValid } from 'utils/date'
import ENTRIES_BY_DATES from 'queries/EntriesByDates.graphql'
import { Entry } from 'components/Entry'

export default function Month({ user, entries }) {
  if (!entries || entries.length == 0) return (
    <>No entries in this month.</>
  )

  return (
    <>
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
  const { client, user } = await ssrRequireAuth(ctx)
  if (!user) return

  const { yyyy, mm } = ctx.params
  if (!isValid.year(yyyy) || !isValid.month(mm)) return

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

  const result = await client.query(ENTRIES_BY_DATES, {
    dateSpan: { fromDate, toDate } }).toPromise()

  return { props: { user, entries: result?.data?.findEntriesByDates } }
}
