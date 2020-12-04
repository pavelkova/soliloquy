import { Editor } from 'components/Editor'
import { ssrMutation, ssrQuery } from 'lib/urql-client'
import TODAY from 'queries/Today.graphql'
import FIND_OR_CREATE_ENTRY from 'mutations/FindOrCreateEntry.graphql'

export default function Today({ today, error }) {
  if (error) return <p>Something went wrong</p>
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
/*
  [TODO] separate today query and create today mutation, then pass reexecuteQuery from [{ data, ...}, reexecuteQuery] = useQuery(TODAY) as a prop to call within useEditor -> unpause, which can't wrap useQuery(TODAY)
*/
    const { data, error } = await ssrMutation(ctx, FIND_OR_CREATE_ENTRY)
  const todayEntry = data?.findOrCreateEntry || {}
  console.log('TODAY ENTRY')
  console.log(todayEntry)
  console.log('--------------------------------------------')
  console.log(error)
    console.log('--------------------------------------------')

  return { props: { today: todayEntry, error } }
}
