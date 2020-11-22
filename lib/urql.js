import { useMemo, useState } from 'react'
import { createClient,
         cacheExchange,
         dedupExchange,
         fetchExchange,
         ssrExchange } from 'urql'
import ssrPrepass from 'react-ssr-prepass'

let urqlClient

const isServer = typeof window === 'undefined'

const ssr = ssrExchange({
  isClient: !isServer,
  initialState: !isServer ? window.__URQL_DATA__ : undefined
})

const resetClient = () => {
  urqlClient = null
}

const createUrqlClient = () => {
  return createClient({
    url: 'http://localhost:3000/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      /* headers: { cookie: token } */
    },
    fetch,
    exchanges: [ dedupExchange,
                 cacheExchange,
                 ssr,
                 fetchExchange
    ],
    suspense: (isServer || clientOptions.suspense)
  })
}

const initUrqlClient = (initialState = null) => {
}

const handleRequest = async (req, res) => {
  const ssrCache
}
