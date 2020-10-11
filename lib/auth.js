import { db } from 'db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// REQUIRE AUTH

export const requireAuth = resolver => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new Error('unauthenticated')
  }
  args.user = context.currentUser
  return resolver(root, args, context, info)
}

// PASSWORD

const validatePassword = async (enteredPassword, userPassword) => {
  return await bcrypt.compare(enteredPassword, userPassword)
}

const encryptPassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

// JWT

export const generateTokens = (user, secret) => {
  const accessToken = jwt.sign(
    { user: { id: user.id } },
    secret,
    { algorithm: 'RS256' }
  )

  /* const refreshToken = jwt.sign(
   *   { user: { id: user.id  } },
   *   process.env.JWT_SECRET,
   *   { expiresIn: 60}
   * ) */

  // set cookie refresh token
  return accessToken
}

export const validateToken = async (token, secret) => {
  const { user } = await jwt.verify(token, secret)
}
