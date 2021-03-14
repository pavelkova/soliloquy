import { initUrqlClient } from 'next-urql'
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import { devtoolsExchange } from '@urql/devtools'
import CURRENT_USER from 'queries/CurrentUser.graphql'

function createUrqlClient(token) {
  const ssrCache = ssrExchange({ isClient: false })

  return initUrqlClient(
    {
      url: 'http://localhost:3000/api/graphql',
      fetchOptions: {
        credentials: 'same-origin',
        headers: {
          cookie: token,
        },
      },
      exchanges: [
        dedupExchange,
        cacheExchange,
        fetchExchange,
        ssrCache,
        devtoolsExchange,
      ],
      fetch,
    },
    true
  )
}

export const checkClientAuth = async ctx => {
  const token = ctx?.req?.headers?.cookie ?? ''
  const client = createUrqlClient(token)

  let user
  if (token) {
    const result = await client.query(CURRENT_USER).toPromise()
    user = result?.data?.currentUser
    console.log(result)
  }

  console.log(token)

  return { user, client }
}

export const redirect = (ctx, condition, location) => {
  if (condition) {
    ctx.res.writeHead(302, { Location: location })
    ctx.res.end()
  }
}
