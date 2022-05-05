import jwt from 'jsonwebtoken'
import { serialize, parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'shared/types'

// COOKIE HELPERS
function setCookie(res: NextApiResponse, key: string, value: string, options: object) {
  const cookie = serialize(key, value, options)
  res.setHeader('Set-Cookie', cookie)
}

function parseCookies(req: NextApiRequest) {
  return req.cookies ?? parse(req.headers?.cookie || '')
}

// JWT HELPERS
function generateToken(user: User, secret: string, maxAge: number): string {
  return jwt.sign({ user }, secret, { expiresIn: maxAge } )
}

function validateToken(token: string, secret: string) {
  return jwt.verify(token, secret)
}

// TODO move to env variables
const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 24 * 15
const JWT_SECRET = "sssssseeeeeecreeeet"

export const setUserToken = (res: NextApiResponse, user: User) => {
  try {
    const token = generateToken(user, JWT_SECRET, MAX_AGE)
    return setCookie(res, TOKEN_NAME, token, {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}

export const getUserToken = (req: NextApiRequest): User => {
  const token = parseCookies(req)[TOKEN_NAME]
  if (token) {
    try {
      const data = validateToken(token, JWT_SECRET)
      return data?.user
    } catch (e) {
      console.error(e.message)
      throw new Error(e)
    }
  }
}

export const revokeUserToken = (res: NextApiResponse) => {
  setCookie(res, TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })
}

export const authenticate = resolver => (root, args, ctx, info) => {
  if (ctx?.user) {
    return resolver(root, args, ctx, info)
  }
  throw new Error('unauthenticated')
}

// export const catchErrors = action => args => {
//   try {
//     action(args)
//   } catch (e) {
//     console.error(e.message)
//     throw new Error(e)
//   }
// }
