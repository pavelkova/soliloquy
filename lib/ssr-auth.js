import { initUrqlClient } from 'next-urql'
import {
  ssrExchange,
  dedupExchange,
  cacheExchange,
  fetchExchange
} from 'urql'
import { devtoolsExchange } from '@urql/devtools'
import CURRENT_USER from 'queries/CurrentUser.graphql'

/** Check on server side for an httpOnly cookie containing a JWT with user information.
 * @param  {Object}  ctx
 * @param  {String}  redirectTo   Page route name to pass to next-router.
 * @param  {Boolean} authRequired Default to true for pages requiring authentication, set to false for                                   pages that shouldn't be available to a logged-in user.
 *
 * @return {Object}
 * @return {Object} client To use in getServerSideProps() for queries and mutations.
 * @return {Object} user
 */
export const ssrAuthCheck = async (ctx, redirectTo, authRequired = true) => {
  const ssrCache = ssrExchange({ isClient: false })
  const token = ctx?.req?.headers?.cookie ?? ''

  const client = initUrqlClient({
    url: 'http://localhost:3000/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        cookie: token
      }
    },
    exchanges: [dedupExchange,
                cacheExchange,
                fetchExchange,
                ssrCache,
                devtoolsExchange],
    fetch
  }, true)

  let user
  if (token) {
    const result = await client.query(CURRENT_USER).toPromise()
    user = result?.data?.currentUser ?? {}
  }

  if (!user && authRequired || user && !authRequired) {
    ctx.res.writeHead(302, { Location: redirectTo })
    ctx.res.end()
  }

  return { user, client }
}

export const ssrRequireAuth = async (ctx) => {
  return await ssrAuthCheck(ctx, '/login', true)
}

export const ssrRequireNoAuth = async (ctx, redirectTo = '/today') => {
  return await ssrAuthCheck(ctx, redirectTo, false)
}
