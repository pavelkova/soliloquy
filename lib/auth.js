import { useMemo, useState } from 'react'
import { Provider,
         createClient,
         cacheExchange,
         dedupExchange,
         fetchExchange,
         ssrExchange } from 'urql'
import ssrPrepass from 'react-ssr-prepass'

let urqlClient

const resetClient = () => {
  urqlClient = null
}

const initUrqlClient = (clientOptions, canEnableSuspense) => {
  // Create a new Client for every server-side rendered request.
  // This ensures we reset the state for each rendered page.
  // If there is an exising client instance on the client-side, use it.
  const isServer = typeofwindow === 'undefined'
  if (isServer || !urqlClient) {
    urqlClient = createClient({
      ...clientOptions,
      suspense: canEnableSuspense && (isServer || clientOptions.suspense)
    })
    // Serialize the urqlClient to null on the client-side.
    // This ensures we don't share client and server instances of the urqlClient.
      urqlClient.toJSON = () => null
  }

  // Return both the Client instance and the ssrCache.
  return urqlClient
}

const getDisplayName = Component => {
  return Component.displayName || Component.name || 'Component'
}

const withUrqlClient = (getClientConfig, options = {}) {
  return (AppOrPage) => {
    const shouldEnableSuspense = Boolean(
      (AppOrPage.getInitialProps || options.ssr) && options.neverSuspend
    )
    const withUrql = ({ urqlClient, urqlState, ...rest }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const forceUpdate = useState(0)

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const client = useMemo(() => {
        if (urqlClient) return urqlClient

        if (!ssr || typeof window === 'undefined') {
          ssr = ssrExchange({ initialState: urqlState })
        }

        const clientConfig = getClientConfig(ssr)
        if (!clientConfig.exchanges) {
          // When the user does not provide exchanges we make the default assumptions.
          clientConfig.exchanges = [
            dedupExchange,
            cacheExchange,
            ssr,
            fetchExchange
          ]
        }

        return initUrqlClient(clientConfig, shouldEnableSuspense)
        // eslint-disable-next-line react-hooks/rules-of-hooks
      }, [urqlClient, urqlState, forceUpdate[0]])

      const resetUrqlClient = () => {
        resetClient()
        ssr = ssrExchange({ initialState: undefined })
        forceUpdate[1](forceUpdate[0] + 1)
      }

      return (
        <Provider value={ client }>
          <AppOrPage
            urqlClient={ client }
            resetUrqlClient={ resetUrqlClient }
            { ...rest }
          />
        </Provider>
      )
    }
  }
}

const client = createClient({
  url: 'http://localhost:3000/api/graphql',
  fetchOptions: {
    credentials: 'same-origin',
    headers: {
      cookie: token
    }
  },
  fetch
}, true)
