import { useRouter } from 'next/router'
import { useQuery } from 'urql'

export default function Date({ ...props }) {
  const router = useRouter()
  const { yyyy, mm, dd } = router.query

  if (!isValid.year(yyyy) || !isValid.month(mm) !isValid.day(dd)) {
    throw new Error('bad date')
    // redirect
  }

  const date = yyyy + '-' + mm + 'dd'

  const { data, fetching, error } = useQuery(ENTRY_BY_DATE, { variables: { date } })

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
  const token = await ssrAuthCheck(ctx)
  const currentUser = await ssrQuery(ctx, CURRENT_USER)
  let props = {}
  props.user = currentUser
  return { props }
}
