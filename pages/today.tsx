import { useEffect } from 'react'
import { useMutation } from 'urql'
import { NextPage } from 'next'
import { Flex } from 'theme-ui'
import { Editor, EditorContainer } from 'components/Editor'
import { formatEntryDate } from 'utils/date'
import { userTimezone } from 'utils/locale'
export { getServerSideProps } from 'lib/ssr/require-auth'

export default function Today(props) {
  const date = formatEntryDate(props.user)
  const tz = userTimezone(props.user)
  return (
    <Flex>
      <EditorContainer date={date} timezone={tz} />
    </Flex>
  )
}

// export const getServerSideProps = async (ctx) => {
//   console.log('TODAY PAGE -> GET SSR PROPS ->')

//   const { user, client } = await clientWithAuth(ctx)

//   return { props: { user } }
// }
