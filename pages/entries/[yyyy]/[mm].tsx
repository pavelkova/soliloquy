import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { clientWithAuth } from 'lib/ssr/client-with-auth'
import { isValid } from 'utils/date'
import ENTRIES_BY_DATES from 'queries/EntriesByDates.graphql'
import { Entry } from 'components/Entry'
import { Calendar } from 'components/Navbar/Calendar'

export default function Month({ user, entries, yyyy, mm }) {
  if (!entries || entries.length == 0) return (
    <>
      {/* <Calendar year={ yyyy } month={ mm } entries={ entries } /> */}
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  console.log('SSR ->')
  const { user, client } = await clientWithAuth(ctx)

  const { yyyy, mm } = ctx.params
  if (!isValid.year(yyyy) || !isValid.month(mm)) return

  const lastDayOfMonth = (y,m) => {
    return new Date(y, m, 0).getDate()
  }

  const fromDate = yyyy + '-' + mm + '-01'
  const toDate = yyyy + '-' + mm + '-' + lastDayOfMonth(yyyy,mm)

  const result = await client.query(ENTRIES_BY_DATES, {
    dateSpan: { fromDate, toDate } }).toPromise()


  return { props: { user,
                    ...ctx.params,
                    entries: result?.data?.findEntriesByDates } }
}
