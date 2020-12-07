import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import { isValid } from 'utils/date'
import { ssrAuthCheck } from 'lib/urql-client'
import ENTRY_BY_DATE from 'queries/EntryByDate.graphql'

export default function Date({ ...props }) {

  const router = useRouter()
  const { yyyy, mm, dd } = router.query

  if (!isValid.year(yyyy) || !isValid.month(mm) || !isValid.day(dd)) {
    throw new Error('bad date')
    // redirect
  }

  const date = yyyy + '-' + mm + '-' + dd
  console.log(date)

  const [{ data, fetching, error }] = useQuery({
    query: ENTRY_BY_DATE,
    variables: { date },
  })

  let entry

  if (fetching) return (<p>Loading...</p>)
  if (error) return (<p>{ error.message }</p>)
  if (data?.findEntryByDate) { entry = data.findEntryByDate }

  console.log(entry)
  return (
    <>
      <h1>{ entry.date}</h1>
  </>
  )
}

export const getServerSideProps = async ctx => {
  console.log('SSR ->')
  const { client, isAuthenticated } = await ssrAuthCheck(ctx, '/login')

  return { props: { isAuthenticated } }
}
