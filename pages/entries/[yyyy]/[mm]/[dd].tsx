import { isValid } from 'utils/date'
import { clientWithAuth } from 'lib/ssr/client-with-auth'
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

  const { props, client } = await clientWithAuth(ctx)

  const { yyyy, mm, dd } = ctx.params
  if (!isValid.year(yyyy) || !isValid.month(mm) || !isValid.day(dd)) return

  const date = yyyy + '-' + mm + '-' + dd
  const result = await client.query(ENTRY_BY_DATE, { date }).toPromise()

  props.entries = result?.data?.findEntryByDate

  return { props }
}
