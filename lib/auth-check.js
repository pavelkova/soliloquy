import { initUrqlClient } from 'next-urql'
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
  const token = ctx?.req?.headers?.cookie ?? ''

  const client = initUrqlClient({
    url: 'http://localhost:3000/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        cookie: token
      }
    },
    fetch
  }, true)

  let user
  if (token) {
    const result = await client.query(CURRENT_USER).toPromise()
    const userData = result?.data?.currentUser

    if (userData) {
    /* This database call returns an array with an object
     * for each setting in the format { id, key, value }.
     * For clarity on the client side, return it as a single
     * settings object in format { key1: value1, key2: value2, ... }
     */
      const settings = {}

      userData.settings.forEach(setting => {
        settings[setting.key] = setting.value
      })
      user = { id: userData.id, email: userData.email, settings }
    }
  }

  if (!user && authRequired || user && !authRequired) {
    ctx.res.writeHead(302, { Location: redirectTo })
    ctx.res.end()
  }

  return { client, user }
}
