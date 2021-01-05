import { Editor } from 'components/Editor'
import { ssrRequireAuth } from 'lib/ssr-auth'
import FIND_OR_CREATE_TODAY from 'mutations/FindOrCreateToday.graphql'

export default function Today(props) {

  if (props.error) return (<p>Something went wrong</p>)
  console.log('TODAY PAGE -> RENDER ->')

  if (!props.today) return <p>today does not exist</p>
  return (
  <div>
      <Editor { ...props } />
    </div>
  )
}

export const getServerSideProps = async ctx => {
  console.log('TODAY PAGE -> GET SSR PROPS ->')

  const props = {}

  const { client, user } = await ssrRequireAuth(ctx)

  if (user) {
    props.user = user
    await client.mutation(FIND_OR_CREATE_TODAY).toPromise().then(result => {
      if (result.error) {
        console.error(result.error)
        props.error = result.error
      }
      props.today = result?.data?.findOrCreateToday || {}
    })
  }

  return { props }
}
