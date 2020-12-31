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
    signup: async (_, { email, name, password }, ctx) => {
      const user = await signup(email, name, password)
      if (user) setUserToken(ctx.res, user)
      return user
    },
    login: async (_, { email, password }, ctx) => {
      console.log('LOGIN MUTATION')
      const user = await login(email, password)
      if (user) setUserToken(ctx.res, user)
      return user
    },
    logout: async (_, {}, ctx) => {
      console.log('ACTIONS -> USER -> LOGOUT ->')
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
