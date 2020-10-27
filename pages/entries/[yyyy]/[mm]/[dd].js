import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import { ssrQuery, ssrAuthCheck } from 'lib/urql-client'
import CURRENT_USER from 'queries/CurrentUser.graphql'

export default function Date({ ...props }) {
  const router = useRouter()
  const { yyyy, mm, dd } = router.query
  console.log(parseInt)
  if (typeof window != 'undefined' && !props.user.currentUser) {
    router.push('/login')
    console.log(router)
  }

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
