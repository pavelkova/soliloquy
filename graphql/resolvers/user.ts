import { IResolvers } from 'graphql-tools'
import { User, Settings } from 'shared/types'
import { authenticate,  setUserToken, revokeUserToken } from './helpers/auth'
import { encryptPassword, validatePassword } from './helpers/hashing'

async function getUserByEmail(prisma, email:string): Promise<User|null> {
    return await prisma.user.findUnique({
        where: {
            email
        }
    })
}

const resolvers: IResolvers = {
    Query: {
        currentUser: async (_, _, ctx): Promise<User> => {
            try {
                if (ctx.user) {
                    return await ctx.prisma.user.findUnique({
                        where: {
                            id: ctx.user.id
                        }
                    })
                } else {
                    throw new Error("Not logged in")
                }
            } catch (e) {
            }
        },
    },
    Mutation: {
        signup: async (_, args, ctx): Promise<User> => {
            try {
                const existingUser = await getUserByEmail(ctx.prisma, args.email)
                if (existingUser) {
                    throw new Error("A user with this email address already exists.")
                } else {
                    const hash = await encryptPassword(args.password)
                    const user = await ctx.prisma.user.create({
                        data: {
                            email: args.email,
                            name: args.name,
                            password: hash,
                            // settings:
                        }
                    })
                    if (user) setUserToken(ctx.res, user)
                    return user
                }
            } catch (e) {
            }
        },
        login: async (_, args: { email: string, password: string }, ctx): Promise<User> => {
            try {
                const user = await getUserByEmail(ctx.prisma, args.email)
                if (user) {
                    const validPassword = await validatePassword(user, args.password)
                    if (validPassword) {
                        return user
                    }
                } else {
                    throw new Error("")
                }

            } catch (e) {
            }
        },
        logout: (_, _, ctx) => {
            return revokeUserToken(ctx)
        },
        updatePassword: authenticate(async (_, args: { currentPassword: string, newPassword: string }, ctx): Promise<User> => {
            try {
                return
            } catch (e) {
            }
        }),
        updateSettings: authenticate(async (_, args, ctx): Promise<User> => {
            try {
                return
            } catch (e) {
            }
        }),
    },
    User: {
        entries: async (entry, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        tags: async (entry, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    }
}
