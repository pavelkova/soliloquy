import { defaultExchanges } from 'urql'
import { devtoolsExchange } from '@urql/devtools'

export const urqlClientOptions = ctx => {
  return {
    url: 'http://localhost:3000/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        cookie: ctx?.req?.headers?.cookie ?? ''
      }
    },
    exchanges: [devtoolsExchange, ...defaultExchanges],
    fetch
  }
}
