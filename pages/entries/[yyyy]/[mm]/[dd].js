import { isValid } from 'utils/date'
import { ssrRequireAuth } from 'lib/ssr-auth'
import ENTRY_BY_DATE from 'queries/EntryByDate.graphql'
import { Entry } from 'components/Entry'

export default function Date({ user, entry }) {
  if (!entry) return <>No entry for this date.</>
  return (
    <>
      <h1>{ entry.date }</h1>
      <p>{ entry.content }</p>
  </>
  )
}

export const getServerSideProps = async ctx => {
  console.log('SSR ->')

  const { client, user } = await ssrRequireAuth(ctx)

  if (!user) return

  const { yyyy, mm, dd } = ctx.params
  if (!isValid.year(yyyy) || !isValid.month(mm) || !isValid.day(dd)) return

  const date = yyyy + '-' + mm + '-' + dd
  const result = await client.query(ENTRY_BY_DATE, { date }).toPromise()

  return { props: { user, entry: result?.data?.findEntryByDate } }
}
