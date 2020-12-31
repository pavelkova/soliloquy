/* import { useEffect } from 'react'
 * import { useMutation } from 'urql' */
import { ssrRequireAuth } from 'lib/auth-check'
import { formatEntryDate } from 'utils/date'
/* import CREATE_ENTRY from 'mutations/CreateEntry.graphql' */
import { Editor } from 'components/Editor'

export default function Today({ user }) {
  /* const [{ data, fetching, error }, createEntry] = useMutation(FIND_OR_CREATE_ENTRY)

   * useEffect(() => {
   *   const variables = { date: formatEntryDate(user.settings.timezone) }
   *   createEntry(variables).then(
   *       result => {
   *         if (error) console.error(error)
   *         if (fetching) console.log(result)
   *         return () => {}
   *     })
   * }, [])

   * return (
   *   <>
   *     { error && <p>Something went wrong.</p> }
   *     { fetching && <p>Loading...</p> }
   *     { data && <Editor entry={ data.findOrCreateEntry } /> }
   *   </>
   * ) */
  console.log('TODAY PAGE')
  const today = { date: formatEntryDate(user.settings.timezone) }
  return (
    <>
    <Editor props={ user, today } />
    </>
  )
}

export const getServerSideProps = async ctx => {
  console.log('TODAY PAGE -> GET SSR PROPS ->')
  const props = {}

  const { user } = await ssrRequireAuth(ctx)
  if (user) props.user = user

  ///
  /* const tz = user.settings.timezone ?? lastEntry.timezone
   * const entryExists = (formatEntryDate(tz) == lastEntry.date) */
  ///
  return { props }
}
