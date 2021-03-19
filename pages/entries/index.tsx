import { clientWithAuth } from 'lib/ssr/client-with-auth'
import ALL_ENTRIES from 'queries/AllEntries.graphql'
import { Entry } from 'components/Entry'

export default function Entries({ user, entries }) {
  if (!entries || entries.length == 0) return (
    <>No entries yet.</>
  )

  return (
    <>
      { entries.map(entry =>
        <div key={ entry.id }>
          <Entry entry={ entry } />
        </div>

      ) }
    </>
  )
}

export const getServerSideProps = async ctx => {
  console.log('SSR ->')
  const { props, client } = await clientWithAuth(ctx)

  const result = await client.query(ALL_ENTRIES).toPromise()
  props.entries = result?.data?.allEntries

  return { props }
}
