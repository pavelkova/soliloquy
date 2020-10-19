import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import { ssrQuery, ssrAuthCheck } from 'lib/urql-client'

// check router if param is 4 digit number between 2000 and present year
import { CURRENT_USER } from '../../../../lib/graphql/User.graphql'

export default function Date({ ...props }) {
  const router = useRouter()
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
