import { useQuery } from 'urql'

const TodosQuery = `
  query {
    todos {
      id
      title
    }
  }
`
