import { findById, findByEmail,
         login, signup, updatePassword }  from 'actions/user'
import { findAll as findUserEntries } from 'actions/entry'
import { findAll as findUserSettings } from 'actions/setting'
import { authenticate, setUserToken, getUserToken, revokeUserToken } from 'services/auth'
import { errors } from 'services/errors'

export default {
  Query: {
    currentUser: async (_, {}, ctx) => {
      if (ctx.user) return ctx.user
      throw new Error(errors.login.notLoggedIn)
    },
    findUserById: async (_, { id }, ctx) => {
      return await findById(id)
    },
    findUserByEmail: async (_, { email }, ctx) => {
      return await findByEmail(email)
    },
  },
  Mutation: {
    signup: async (_, { email, password }, ctx) => {
      let user = await signup(email, password)
      if (user) setUserToken(ctx.res, user)
      return user
    },
    login: async (_, { email, password }, ctx) => {
      console.log('LOGIN MUTATION')
      let user = await login(email, password)
      if (user) setUserToken(ctx.res, user)
      return user
    },
    logout: async (_, {}, ctx) => {
      // remove cookie
      await revokeUserToken()
      return false
    },
    updatePassword: authenticate(async(_, { oldPassword, newPassword }, ctx) => {
      const updatedUser = await updatePassword(
        ctx.user, oldPassword, newPassword)
      return updatedUser
    })
  },
  User: {
    entries: async (user, {}, ctx) => {
      return await findUserEntries(user)
    },
    settings: async (user, {}, ctx) => {
      return await findUserSettings(user)
    }
  }
}
