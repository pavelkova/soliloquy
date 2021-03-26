import { findById, findByEmail,
         login, signup, updatePassword, updateSettings }  from '../actions/user'
import { findAll as findUserEntries } from '../actions/entry'
import { authenticate, setUserToken, getUserToken, revokeUserToken } from '../actions/auth'

export default {
  Query: {
    currentUser: async (_, {}, ctx) => {
      console.log('RESOLVERS -> CURRENT USER ->')
      if (ctx.user) return await findById(ctx.user.id)
      throw new Error('not logged in')
    },
    findUserById: async (_, { id }, ctx) => {
      return await findById(id)
    },
    findUserByEmail: async (_, { email }, ctx) => {
      return await findByEmail(email)
    },
  },
  Mutation: {
    signup: async (_, { email, name, password, timezone, browserTimezone }, ctx) => {
      const user = await signup(email, name, password, timezone)
      if (user) setUserToken(ctx.res, user, browserTimezone)
      return user
    },
    login: async (_, { email, password, browserTimezone }, ctx) => {
      const user = await login(email, password)
      if (user) setUserToken(ctx.res, user, browserTimezone)
      return user
    },
    logout: async (_, {}, ctx) => {
      return await revokeUserToken(ctx)
    },
    updatePassword: authenticate(async(_, { oldPassword, newPassword }, ctx) => {
      return await updatePassword(ctx.user, oldPassword, newPassword)
    }),
    updateSettings: authenticate(async(_, { settings }, ctx) => {
      return await updateSettings(ctx.user, settings)
    })
  },
  User: {
    entries: async (user, {}, ctx) => {
      return await findUserEntries(user)
    }
  }
}
