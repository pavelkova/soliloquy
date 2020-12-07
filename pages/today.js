import { Editor } from 'components/Editor'
import { ssrMutation } from 'lib/urql-client'
import FIND_OR_CREATE_ENTRY from 'mutations/FindOrCreateEntry.graphql'

export default function Today({ today, error }) {
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

  const { data, error } = await ssrMutation(ctx, FIND_OR_CREATE_ENTRY)
  const today = data?.findOrCreateEntry ?? {}

  return { props: { today, error } }
}
