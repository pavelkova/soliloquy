import { Editor } from 'components/Editor'
import { useQuery, useMutation } from 'urql'
import { UPDATE_ENTRY } from '../lib/graphql/Entry.graphql'

export default function Today() {
  return (
    <Editor/>
  )
}
