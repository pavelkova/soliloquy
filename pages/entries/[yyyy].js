import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import ENTRIES_BY_DATE from 'queries/EntriesByDate.graphql'

export default function Year() {
  const router = useRouter()

  const { yyyy } = router.query
  let currentYear = new Date().getFullYear()
  if (yyyy.match(/([0-9]{4})/)
      && 1970 <= yyyy // user.createdAt.getFullYear()
      && yyyy <= currentYear) {
    const { data, fetching, error } = useQuery(ENTRIES_BY_DATE, { variables: yyyy })
  }
  console.log(router)
  /* console.log('YEAR ->')
   * console.log(router.query) */
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
