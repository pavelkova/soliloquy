import { getTokenCookie,
         setTokenCookie,
         removeTokenCookie,
         MAX_AGE } from './auth-helpers/cookies'
import { generateTokens, validateToken } from './auth-helpers/tokens'

// REQUIRE AUTH

export const authenticate = resolver => (root, args, ctx, info) => {
  if (ctx?.user) {
    return resolver(root, args, ctx, info)
  }
  throw new Error('unauthenticated')
}

export const setUserToken = async (res, user) => {
  /* const data = { user, createdAt: Date.now(), maxAge: MAX_AGE} */
  const userData = { id: user.id, email: user.email }
  try {
    const token = await generateTokens({ user: userData }, MAX_AGE)
    return setTokenCookie(res, token)
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}

export const getUserToken = async req => {
  const token = getTokenCookie(req)
  if (token) {
    try {
      const data = await validateToken(token)
      console.log(data)
      return data?.user
    } catch (e) {
      console.error(e.message)
      throw new Error(e)
    }
  }
}

export const revokeUserToken = async ctx => {
  removeTokenCookie(ctx.res)
  console.log(ctx.req.headers)
}

const currentUser = async ctx => {
  let user = await getUserToken(ctx.req)
  if (user) return await findById(user.id)
  throw new Error('unauthenticated')
}
