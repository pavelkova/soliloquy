import { findById, findByEmail,
         login, signup, updatePassword, updateSettings }  from 'actions/user'
import { findAll as findUserEntries } from 'actions/entry'
import { authenticate, setUserToken, getUserToken, revokeUserToken } from 'services/auth'
import { errors } from 'services/errors'

export default {
  Query: {
    currentUser: async (_, {}, ctx) => {
      console.log('RESOLVERS -> CURRENT USER ->')
      if (ctx.user) return await findById(ctx.user.id)
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
    signup: async (_, { email, name, password, browserTimezone }, ctx) => {
      const user = await signup(email, name, password)
      if (user) setUserToken(ctx.res, user, browserTimezone)
      return user
    },
    login: async (_, { email, password, browserTimezone }, ctx) => {
      console.log('LOGIN MUTATION')
      const user = await login(email, password)
      // check for user.settings.timezone
      if (user) setUserToken(ctx.res, user, browserTimezone)
      return user
    },
    logout: async (_, {}, ctx) => {
      // remove cookie
      console.log(ctx.user)
      const result = await revokeUserToken(ctx)
      console.log('ACTIONS -> USER -> LOGOUT ->')
      console.log(result)
      /* console.log(ctx.req.headers) */
      return
    },
    updatePassword: authenticate(async(_, { oldPassword, newPassword }, ctx) => {
      const updatedUser = await updatePassword(
        ctx.user, oldPassword, newPassword)
      return updatedUser
    }),
    updateSettings: authenticate(async(_, { settings }, ctx) => {
      const newSettings = await updateSettings(ctx.user, settings)
      console.log(newSettings)
      return
      /* const updatedUser = await updateSettings(ctx.user, settings)
       * return updatedUser */
    })
  },
  User: {
    entries: async (user, {}, ctx) => {
      return await findUserEntries(user)
    }
  }
}
