import { initUrqlClient } from 'next-urql'
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import { devtoolsExchange } from '@urql/devtools'
import CURRENT_USER from 'queries/CurrentUser.graphql'

/** Check on server side for an httpOnly cookie containing a JWT with user information.
 * @param  {Object}  ctx
 *
 * @return {Object}
 * @return {Object} client To use in getServerSideProps() for queries and mutations.
 * @return {Object} props With user object if authenticated.
 */

export const createUrqlClient = token => {
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

export const redirect = (condition, location) => {
  if (condition) {
    ctx.res.writeHead(302, { Location: location })
    ctx.res.end()
  }
}

/* async function checkAuth(ctx) {
 *   const token = ctx?.req?.headers?.cookie ?? ''
 *   const client = createUrqlClient(token)
 *
 *   const unauthorizedOnly = Boolean(ctx.resolvedUrl.includes('login' || 'signup'))
 *   let user
 *
 *   if (token) {
 *     const result = await client.query(CURRENT_USER).toPromise()
 *     user = result?.data?.currentUser
 *   }
 *
 *
 *   if (user && unauthorizedOnly) {
 *     ctx.res.writeHead(302, { Location: '/today' })
 *     ctx.res.end()
 *   }
 *
 *   if (!user && !unauthorizedOnly) {
 *     ctx.res.writeHead(302, { Location: '/login' })
 *     ctx.res.end()
 *   }
 *
 *   return { user, client }
 * } */

export const checkAuth = async ctx => {
  const token = ctx?.req?.headers?.cookie ?? ''
  const client = createUrqlClient(token)

  let user
  if (token) {
    const result = await client.query(CURRENT_USER).toPromise()
    user = result?.data?.currentUser
  }

  return { user, client }
}

export const requireNoAuth = async ctx => {
  const { user } = await checkAuth(ctx)

  redirect(user, '/today')

  return { props: {} }
}

export const requireAuth = async ctx => {
  const { user } = await checkAuth(ctx)

  redirect(!user, '/login')

  return { props: { user } }
}

export const clientWithAuth = async ctx => {
  const { user, client } = await checkAuth(ctx)

  redirect(!user, '/login')

  return { props: { user }, client }
}

/* export const ssrAuthCheck = async (ctx) => {
 *   const ssrCache = ssrExchange({ isClient: false })
 *   const token = ctx?.req?.headers?.cookie ?? ''
 *
 *   const client = initUrqlClient(
 *     {
 *       url: 'http://localhost:3000/api/graphql',
 *       fetchOptions: {
 *         credentials: 'same-origin',
 *         headers: {
 *           cookie: token,
 *         },
 *       },
 *       exchanges: [
 *         dedupExchange,
 *         cacheExchange,
 *         fetchExchange,
 *         ssrCache,
 *         devtoolsExchange,
 *       ],
 *       fetch,
 *     },
 *     true
 *   )
 *
 *   const unauthorizedOnly = Boolean(ctx.resolvedUrl.includes('login' || 'signup'))
 *   let user
 *
 *   if (token) {
 *     const result = await client.query(CURRENT_USER).toPromise()
 *     user = result?.data?.currentUser ?? {}
 *
 *     if (user && unauthorizedOnly) {
 *       ctx.res.writeHead(302, { Location: '/today' })
 *       ctx.res.end()
 *     }
 *   }
 *
 *   if (!user && !unauthorizedOnly) {
 *     ctx.res.writeHead(302, { Location: '/login' })
 *     ctx.res.end()
 *   }
 *
 *   return { props: { user } , client }
 * } */


// easy import for pages that don't perform additional server-side queries or mutations
export const getServerSideProps = async ctx => {
  const { props } = ssrAuthCheck(ctx)
  console.log(props)
  return { props }
}
