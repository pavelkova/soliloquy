import { Editor } from 'components/Editor'
import { useQuery, useMutation } from 'urql'
import { ssrMutation, ssrAuthCheck } from 'lib/urql-client'
import FIND_OR_CREATE_ENTRY from 'mutations/FindOrCreateEntry.graphql'

export default function Today({ today }) {
  console.log('TODAY PAGE -> RENDER ->')
  console.log(today)
  if (!today) return <p>today does not exist</p>
  return (
    <div>
    <Editor today={ today }/>
    </div>
  )
}

export const getServerSideProps = async ctx => {
  console.log('TODAY PAGE -> GET SSR PROPS ->')
  console.log('FIND OR CREATE ENTRY')
  console.log(FIND_OR_CREATE_ENTRY)
  const { data, error } = await ssrMutation(ctx, FIND_OR_CREATE_ENTRY)
  const todayEntry = data?.findOrCreateEntry || {}
console.log(todayEntry)
  console.log('--------------------------------------------')
  console.log(error)
  console.log('--------------------------------------------')

  return { props: { today: todayEntry, error } }
}
