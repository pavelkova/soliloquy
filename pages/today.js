import { Editor } from 'components/Editor'
import { ssrAuthCheck } from 'lib/auth-check'
import FIND_OR_CREATE_ENTRY from 'mutations/FindOrCreateEntry.graphql'

export default function Today({ today, user, error }) {

  if (error) return (<p>Something went wrong</p>)
  console.log('TODAY PAGE -> RENDER ->')

  if (!today) return <p>today does not exist</p>

  return (
  <div>
      <Editor today={ today }/>
    </div>
  )
}

export const getServerSideProps = async ctx => {
  console.log('TODAY PAGE -> GET SSR PROPS ->')

  const props = {}

  const { client, user } = await ssrAuthCheck(ctx, '/login')

  if (user) {
    props.user = user
    await client.mutation(FIND_OR_CREATE_ENTRY).toPromise().then(result => {
      if (result.error) {
        console.error(result.error)
        props.error = result.error.message
      }
      props.today = result?.data?.findOrCreateEntry || {}
    })
  }
  console.log(props)

  return { props }
}
