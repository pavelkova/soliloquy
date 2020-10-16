import { findById, findByEmail,
         login, signup, updatePassword }  from 'actions/user'
import { findAll as findUserEntries } from 'actions/entry'
import { findAll as findUserSettings } from 'actions/setting'
import { authenticate, setUserToken, getUserToken } from 'services/auth'
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
      return await signup(email, password)
    },
    login: async (_, { email, password }, ctx) => {
      let user = await login(email, password)
      if (user) setUserToken(ctx.res, user)
      return user
    },
    updatePassword: authenticate(async(_, { oldPassword, newPassword }, ctx) => {
      const updatedUser = await updatePassword(ctx.user, oldPassword, newPassword)
      return updatedUser
    })
  },
  User: {
    entries: async (user, {}, ctx) => {
      /* if (user.id === ctx.user.id) { */
      try {
        return await findUserEntries(user)
      } catch (e) {
        console.error(e.message)
      }
      /* } */
    },
    settings: async (user, {}, ctx) => {
      return await findUserSettings(user)
    }
  }
}
