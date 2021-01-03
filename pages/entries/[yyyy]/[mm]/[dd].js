import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import { isValid } from 'utils/date'
import { ssrAuthCheck } from 'lib/auth-check'
import ENTRY_BY_DATE from 'queries/EntryByDate.graphql'

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

  const { client, user } = await ssrAuthCheck(ctx, '/login')

  if (!user) return

  const { yyyy, mm, dd } = ctx.params
  if (!isValid.year(yyyy) || !isValid.month(mm) || !isValid.day(dd)) return

  const date = yyyy + '-' + mm + '-' + dd
  const result = await client.query(ENTRY_BY_DATE, { date }).toPromise()

  return { props: { user, entry: result?.data?.findEntryByDate } }
}
