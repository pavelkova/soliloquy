import jwt from 'jsonwebtoken'

const JWT_SECRET = "sssssseeeeeecreeeet"

const generateTokens = (user, maxAge) => {
  const accessToken = jwt.sign(
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
  return accessToken
}

const validateToken = token => {
  if (token) {
    return jwt.verify(token, JWT_SECRET)
  }
  throw new Error('no token')
}

export { generateTokens, validateToken }
