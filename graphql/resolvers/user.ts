import { IResolvers } from 'graphql-tools'
import { User, Settings } from 'shared/types'
import { authenticate } from './helpers/auth'

const resolvers: IResolvers = {
    Query: {
    },
    Mutation: {
        signup: async (_, args, ctx): Promise<User> => {
            try {
                return
            } catch (e) {
            }
        },
        login: async (_, args: { email: string, password: string }, ctx): Promise<User> => {
            try {
                return
            } catch (e) {
            }
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
