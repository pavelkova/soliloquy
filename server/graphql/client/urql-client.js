import { createClient,
         cacheExchange,
         dedupExchange,
         fetchExchange,
         ssrExchange } from 'urql'
import { authExchange } from '@urql/exchange-auth'

const isServerSide = typeof window === 'undefined';

const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide
              ? window.__URQL_DATA__
              : undefined,
})

const client = createClient({
  url: '/api/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange,
    ssr,
    fetchExchange
  ]
})
