import { Editor } from 'components/Editor'
import { ssrMutation, ssrAuthCheck } from 'lib/urql-client'
import { useMutation } from 'urql'
import FIND_OR_CREATE_ENTRY from 'mutations/FindOrCreateEntry.graphql'

export default function Today({ today, error }) {
  if (error) return <p>Something went wrong</p>
  console.log('TODAY PAGE -> RENDER ->')
/* if (window == 'undefined') return <p>what is happening</p> */
  /* console.log(document) */
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
  const { data, error } = await ssrMutation(ctx, FIND_OR_CREATE_ENTRY)
  const todayEntry = data?.findOrCreateEntry || {}
  console.log('TODAY ENTRY')
  console.log(todayEntry)
  console.log('--------------------------------------------')
  console.log(error)
  console.log('--------------------------------------------')

  return { props: { today: todayEntry, error } }
}
