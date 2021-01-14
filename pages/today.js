import { Editor } from 'components/Editor'
import { ssrRequireAuth, ssrMutationWithAuth } from 'lib/ssr-auth'
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

  const { user, client }  = await ssrRequireAuth(ctx)

  if (!user) return
  const props = { user }

  await client.mutation(FIND_OR_CREATE_TODAY).toPromise().then(
    result => {
      if (result.error) {
        console.error(result.error)
        props.error = result.error
      }
      props.today = result?.data?.findOrCreateToday || {}
  })

  return { props }
}
