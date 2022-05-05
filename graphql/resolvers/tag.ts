import { IResolvers } from 'graphql-tools'
import { Entry, Tag } from 'shared/types'
import { authenticate } from './helpers/auth'

const resolvers: IResolvers = {
    Query: {
        findAllTags: authenticate(async (_, {}, ctx): Promise<Tag[]> => {
            // DEBUG returning tag trees
            try {
                return await ctx.prisma.tags.findMany({
                    where: {
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
    },
    Mutation: {
        createTag: authenticate(async (_, { name, parentId = null }: { name: string, parentId?: number }, ctx): Promise<Tag> => {
            try {
                return ctx.prisma.tag.create({ data: {
                    name,
                    parentId
                }})
            } catch (e) {
            }
            return await ctx.prisma.tag.create()
        }),
        updateTag: authenticate(async (_, args: { id: number, name: string, parentId?: number }, ctx): Promise<Tag> => {
            try {
                return
            } catch (e) {
            }
            return ctx.prisma.tag.update({
                where: {
                    id: args.id,
                    User: {
                        id: ctx.user.id
                    }
                },
                data: { ...args }
            })
        }),
        deleteTag: authenticate(async (_, { id }: { id: number }, ctx) => {
            // TODO handle cascading/reparenting
            try {
                return await ctx.prisma.tag.delete({
                    where: {
                        id,
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
        addTagToEntry: authenticate(async (_, args: { entryId: number, tagName: string }, ctx) => {
            // TODO make tag name & user unique property
            try {
                return await ctx.prisma.entry.update({
                    where: {
                        id: args.entryId,
                        User: {
                            id: ctx.user.id
                        }
                    },
                    data: {
                        tags: {
                            connectOrCreate: {
                                where: {
                                    name: args.tagName
                                },
                                create: {
                                    User: {
                                        id: ctx.user.id
                                    }
                                }
                            }
                        }
                    }
                })
            } catch (e) {
            }
        }),
        deleteTagFromEntry: authenticate(async (_, args: { entryId: number, tagId: number }, ctx) => {
            try {
                return await ctx.prisma.entry.update({
                    where: {
                        id: args.entryId
                    },
                    data: {
                        tags: {
                            disconnect: [{ id: args.tagId }]
                        }
                    },
                    select: {
                        tags: true
                    }
                })
            } catch (e) {
            }
        })
    },
    Tag: {
        user: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        parent: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        children: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        entries: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    }
}
