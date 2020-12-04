import { initUrqlClient } from 'next-urql'
import CURRENT_USER from 'queries/CurrentUser.graphql'

export const ssrAuthCheck = (ctx, redirectTo) => {
  let token
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
    token = ctx.req.headers.cookie
  }
  if (!token) {
    ctx.res.writeHead(302, { Location: redirectTo })
    ctx.res.end()
    return
  }
  return token
}

export const ssrMutation = async (ctx, gqlMutation, redirectTo = '/login') => {
  console.log('ssrMutation -> ssrAuthCheck ->')
  const token = ssrAuthCheck(ctx, redirectTo)
  console.log('token ->')
  console.log(token)
  if (!token) return {data: {}, error: 'unauthenticated'}

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

  const { data, error } = await client.mutation(gqlMutation).toPromise()

  if (error) {

    // Print to server console
    console.error(error.message)
  }

  console.log('SSR MUTATION RESULT ->')
  console.log({ data, error: error?.message || ''})

  return { data, error: error?.message || '' }
}

export const ssrQuery = async (ctx, gqlQuery, redirectTo = '/login') => {
  const token = ssrAuthCheck(ctx, redirectTo)
  if (!token) return {data: {}, error: 'unauthenticated'}

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
