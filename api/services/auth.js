import { setTokenCookie, getTokenCookie, MAX_AGE } from './auth-helpers/cookies'
import { generateTokens, validateToken } from './auth-helpers/tokens'

// REQUIRE AUTH

export const authenticate = resolver => (root, args, ctx, info) => {
  if (ctx?.user) {
    return resolver(root, args, ctx, info)
  }
  throw new Error('unauthenticated')
}

export const setUserToken = async (res, user) => {
  const data = { user, createdAt: Date.now(), maxAge: MAX_AGE}
  try {
    const token = await generateTokens(data, MAX_AGE)
    return setTokenCookie(res, token)
  } catch (e) {
    console.error(e.message)
  }
}

export const getUserToken = async req => {
  const token = getTokenCookie(req)
  if (!token) return
  try {
    const data = await validateToken(token)
    return data?.user
  } catch (e) {
    console.error(e.message)
  }
}

const currentUser = async ctx => {
  let user = await getUserToken(ctx.req)
  if (user) return await findById(user.id)
  throw new Error('not logged in')
}
