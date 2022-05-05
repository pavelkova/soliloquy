import jwt from 'jsonwebtoken'
import { User } from 'shared/types'

const JWT_SECRET = "sssssseeeeeecreeeet"

const generateTokens = (user: User, maxAge: number): string => {
  // const accessToken = jwt.sign(
  return jwt.sign(
    user,
    JWT_SECRET,
    { expiresIn: maxAge }
  )
  /* const refreshToken = jwt.sign(
   *   { user: { id: user.id  } },
   *   secret,
   *   { expiresIn: 60 * 60 * 24 * 15 * 1000}
   * ) */
  // set cookie refresh token
  // return accessToken
}

const validateToken = (token: string) => {
  if (token) {
    return jwt.verify(token, JWT_SECRET)
  }
  throw new Error('no token')
}

export { generateTokens, validateToken }
