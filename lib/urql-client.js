import { initUrqlClient } from 'next-urql'

export const ssrQuery = async (ctx, gqlQuery) => {
  const client = initUrqlClient({
    url: 'http://localhost:3000/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        cookie: ctx.req?.headers?.cookie || null
      }
    },
    fetch
  }, true)

  const { data, error } = await client.query(gqlQuery).toPromise()

  if (error) {
    console.error(error)
  }

  return data
}

export const ssrAuthCheck = ctx => {
  let token
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
    token = ctx.req.headers.cookie
  }
  return token
}
