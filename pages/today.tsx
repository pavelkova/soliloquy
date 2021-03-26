import { Editor } from 'components/Editor'
import { clientWithAuth } from 'lib/ssr/client-with-auth'
import FIND_OR_CREATE_TODAY from 'mutations/FindOrCreateToday.graphql'

export default function Today(props) {
  console.log(props)

  if (props.error) return (<p>Something went wrong</p>)
  console.log('TODAY PAGE -> RENDER ->')

  if (!props.today) return <p>today does not exist</p>

  return <Editor { ...props } />
}

export const getServerSideProps = async ctx => {
  console.log('TODAY PAGE -> GET SSR PROPS ->')

  const { user, client } = await clientWithAuth(ctx)

  await client.mutation(FIND_OR_CREATE_TODAY).toPromise().then(
    result => {
      if (result.error) {
        console.error(result.error)
        props.error = result.error.message
      }
      props.today = result?.data?.findOrCreateToday || {}
  })

  return { props: { user } }
}
