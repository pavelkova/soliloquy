import { NextPage } from 'next'
import { clientWithAuth } from 'lib/ssr/client-with-auth'
import { isValid } from 'utils/date'
import ENTRIES_BY_DATES from 'queries/EntriesByDates.graphql'
import { Entry } from 'components/Entry'

export default function Year({ user, entries }) {
  if (!entries || entries.length == 0) return (
    <>No entries in this year.</>
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
  const { user, client } = await clientWithAuth(ctx)

  const { yyyy } = ctx.params
  if (!isValid.year(yyyy)) return

  const fromDate = yyyy + '-01-01'
  const toDate = yyyy + '-12-31'

  const result = await client.query(ENTRIES_BY_DATES, {
    dateSpan: { fromDate, toDate } }).toPromise()

  return { props: { user, ...ctx.params,
                    entries: result?.data?.findEntriesByDates } }
}
