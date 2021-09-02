import { findById, findByEmail,
         login, signup, updatePassword, updateSettings }  from '../actions/user'
import { IResolvers } from 'graphql-tools'
import { findAll as findUserEntries } from '../actions/entry'
import { authenticate, setUserToken, getUserToken, revokeUserToken } from '../actions/auth'
import Ctx from '../context'

const UserResolvers: IResolvers = {
  Query: {
    currentUser: async (_, {}, ctx: Ctx) => {
        console.log('RESOLVERS -> CURRENT USER ->')
        console.log(ctx.user)
      if (ctx.user) return await findById(ctx.user.id)
      throw new Error('not logged in')
    },
      findUserById: async (_, args: { id: number }, ctx: Ctx) => {
          console.log(args)
      return await findById(args.id)
    },
    findUserByEmail: async (_, { email }, ctx) => {
      return await findByEmail(email)
    },
  },
  Mutation: {
    signup: async (_, { email, name, password, timezone }, ctx): Promise<User> => {
      const user = await signup(email, name, password, timezone)
      if (user) setUserToken(ctx.res, user)
      return user
    },
      login: async (_, { email, password, browserTimezone }, ctx): Promise<User> => {
          const user = await login(email, password)
          if (user) {
              const session = { userId: user.id, userEmail: user.email, loginTime: new Date(), browserTimezone }
              setUserToken(ctx.res, session)
          }
      return user
    },
    logout: async (_, {}, ctx): Promise<boolean> => {
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

export default UserResolvers
