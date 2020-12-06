import { initUrqlClient } from 'next-urql'
import CURRENT_USER from 'queries/CurrentUser.graphql'

/** Check on server side for an httpOnly cookie containing a JWT with user information.
 * @param  {Object}  ctx
 * @param  {String}  redirectTo   Page route name to pass to next-router.
 * @param  {Boolean} authRequired Default to true for pages requiring authentication, set to false for                                   pages that shouldn't be available to a logged-in user.
 *
 * @return {Object} If cookie exists, return
 */
export const ssrAuthCheck = (ctx, redirectTo, authRequired = true) => {
  /* let token = ''
   * let isAuthenticated = false
   */
  /* if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
   *   console.log(ctx.req.headers.cookie)
   *   // TODO check if ctx.req.headers.cookie implies token will not be an empty string--if so, remove condition on setting isAuthenticated
   *   token = ctx.req.headers.cookie
   *   if (token) { isAuthenticated = true }
   * } */


  const token = ctx?.req?.headers?.cookie ?? ''
  const isAuthenticated = token ? true : false

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

  if (!token && authRequired || token && !authRequired) {
    ctx.res.writeHead(302, { Location: redirectTo })
    ctx.res.end()
  }

  // TODO add: if (isAuthenticated) await client.query(current user with settings)

  return { client, isAuthenticated }
}

export const ssrMutation = async (ctx, gqlMutation, redirectTo = '/login') => {
  console.log('ssrMutation -> ssrAuthCheck ->')
  const { client, isAuthenticated } = ssrAuthCheck(ctx, redirectTo)

  if (!isAuthenticated) return

  const { data, error } = await client.mutation(gqlMutation).toPromise()

  if (error) {
next
    // Print to server console
    console.error(error.message)
  }

  console.log('SSR MUTATION RESULT ->')
  console.log({ data, error: error?.message || ''})

  return { data, error: error?.message || '' }
}

export const ssrQuery = async (ctx, gqlQuery, redirectTo = '/login') => {
  const { client, isAuthenticated } = ssrAuthCheck(ctx, redirectTo)

  if (!isAuthenticated) return

  const result = await client.query(gqlQuery).toPromise()

  return result
}


/*
DB
Business Logic
GraphQL API
SSR Props -> GQL
Page -> GQL
*/

// ------------------------------------------------------------
/* import { createContext, useEffect, useState } from 'react'
 *
 * const AuthContext = createContext({
 *   isAuthenticated: false,
 *   isLoading: true,
 *   setAuthenticated: () => {}
 * })
 *
 * const AuthProvider = ({ children }) => {
 *   const [isAuthenticated, setAuthenticated] = useState(false)
 *   const [isLoading, setLoading] = useState(true)
 *
 *   useEffect(() => {
 *     const initializeAuth = async () => {
 *       const response = await fetch('/api/checkAuth')
 *       setAuthenticated(response.status = 200)
 *       setLoading(false)
 *     }
 *     initializeAuth()
 *   }, [])
 *
 *   return (
 *     <AuthContext.Provider
 *       value={{ isAuthenticated,
 *                isLoading,
 *                setAuthenticated }}>
 *     { children }
 *     </AuthContext.Provider>
 *   )
 * }
 *
 * const useAuth = () => {
 *   const context = useContext(AuthContext)
 *   if (context === undefined) {
 *     throw new Error('useAuth must be used within an AuthProvider')
 *   }
 *   return context
 * }
 *
 * const useIsAuthenticated = () => {
 *   const context = useAuth()
 *   return context.isAuthenticated
 * }
 *  */
// ------------------------------------------------
/* export async function getServerSideProps(ctx) {
 *   const { req: { headers, url }, res} = ctx
 *   const cookies = {}
 *   if (headers && headers.cookie) {
 *     headers.cookie.split(';').forEach(cookie => {
 *       const parts = cookie.match(/(.*?)=(.*)$/)
 *       cookies[parts[1].trim()] = (parst[2] || '').trim()
 *     })
 *   }
 *   const isAuthenticated = !!cookies.username
 *   const isAdmin = !!cookies.isAdmin
 *   if (!isAuthenticated) {
 *     res.setHeader('Location', '/login?from=${url}')
 *     res.statusCode = 307
 *   }
 *   if (isAuthenticated
 *       && url.includes('admin') && !isAdmin) {
 *     res.setHeader('Location', '/')
 *     res.statusCode = 307
 *   }
 *   return {
 *     props: {
 *     }
 *   }
 * } */
