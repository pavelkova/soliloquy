import { getTokenCookie,
         setTokenCookie,
         removeTokenCookie,
         MAX_AGE } from './auth/cookies'
import { generateTokens, validateToken } from './auth/tokens'

// REQUIRE AUTH

export const authenticate = resolver => (root, args, ctx, info) => {
  if (ctx?.user) {
    return resolver(root, args, ctx, info)
  }
  throw new Error('unauthenticated')
}

// TODO make these functions synchronous
export const setUserToken = async (res, user, browserTimezone) => {
  const tz = user.settings.timezone == 'AUTO' ?
             browserTimezone : user.settings.timezone

  const userData = { id: user.id, email: user.email, tz }
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
      return data?.user
    } catch (e) {
      console.error(e.message)
      throw new Error(e)
    }
  }
}

export const revokeUserToken = async ctx => {
  removeTokenCookie(ctx.res)
}
