import { useEffect } from 'react'
import { useMutation } from 'urql'
import { NextPage } from 'next'
import { Flex, Message, Spinner } from 'theme-ui'
import { DateHeader } from 'components/Entry/DateHeader'
import { Editor } from 'components/Editor'
import { clientWithAuth } from 'lib/ssr/client-with-auth'
import { formatEntryDate } from 'utils/date'
import { userTimezone } from 'utils/locale'
import FIND_OR_CREATE_ENTRY from 'mutations/FindOrCreateEntry.graphql'

export default function Today(props) {
  const [result, mutation] = useMutation(FIND_OR_CREATE_ENTRY)
  const date = formatEntryDate(props.user)

  useEffect(() => {
    const findOrCreateToday = async () => {
      return await mutation({ date, timezone: userTimezone(props.user) })
    }
    
    findOrCreateToday()
  }, [])

  if (result.error) console.error(result.error)
  return (
    <Flex>
    <DateHeader date={ date } />
    { result.fetching && <Spinner /> }
    { result.error && <Message>Something went wrong.</Message> }
    { result.data?.findOrCreateEntry &&
      <Editor user={ props.user } entry={ result.data.findOrCreateEntry } /> }
    </Flex>
  )
}

export const getServerSideProps = async ctx => {
  console.log('TODAY PAGE -> GET SSR PROPS ->')

  const { user, client } = await clientWithAuth(ctx)

  /* await client.mutation(FIND_OR_CREATE_TODAY).toPromise().then(
   *   result => {
   *     if (result.error) {
   *       console.error(result.error)
   *       props.error = result.error.message
   *     }
   *     props.today = result?.data?.findOrCreateToday || {}
   * }) */

  return { props: { user } }
}
