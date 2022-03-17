import bcrypt from 'bcrypt'
import { IResolvers } from 'graphql-tools'

const authenticate = resolver => (_parent, _args, ctx) => {
    if (ctx?.user) {
        return resolver(_parent, _args, ctx)
    }
    throw new Error('Not authenticated')
}

interface User {
    id: string
    email: string
    name?: string
    password: string
    createdAt: Date
    updatedAt: Date
    settings: Settings
}

interface Settings {
}

interface Entry {
    id: string
    user: User
    date: string
    timezone: string
    createdAt: Date
    updatedAt: Date
    activityLogs?: ActivityLog[]
    tags?: Tag[]
}

interface ActivityLog {
    id: string
    entry: Entry
    content: string
    wordCount: number
    lowestWordCount: number
    createdAt: Date
    updatedAt: Date
}

interface Tag {
    id: string
    user: User
    name: string

    parent?: Tag
    children?: Tag[]
    createdAt: Date
    updatedAt: Date
}

const resolvers: IResolvers = {
    Query: {
        findEntryByDate: authenticate(async (_, { date }: { date: string }, ctx): Promise<Entry> => {
            try {
                return await ctx.prisma.entry.findUnique({
                    where: {
                        date,
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
        findEntriesByDateSpan: authenticate(async (_, args, ctx): Promise<Entry[]> => {
            try {
                // TODO ref prisma documentation for date queries
                return await ctx.prisma.entry.findMany({
                    where: {
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
        findAllEntries: authenticate(async (_, {}, ctx): Promise<Entry[]> => {
            try {
                return await ctx.prisma.entry.findMany({
                    where: {
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
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
        signup: async (_, args: { email: string, password: string, timezone?: string }, ctx): Promise<User> => {
            try {
                const existingUser = await ctx.prisma.user.findUnique({
                    where: {
                        email: args.email
                    }
                })
                if (existingUser) {
                    throw new Error()
                } else {
                    const hashedPassword = args.password
                    return await ctx.prisma.user.create({
                        data: { email: args.email, password: hashedPassword }
                    })
                }
            } catch (e) {
            }
        },
        login: async (_, args: { email: string, password: string }, ctx): Promise<User> => {
            try {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: args.email
                    }
                })
                if (user && (args.password == user.password)) {
                    // TODO login process: set cookie, add to ctx
                } else {
                    throw new Error("Invalid email or password.")
                }
                return user
            } catch (e) {
            }
        },
        logout: authenticate(async (_, {}, ctx) => {
            try {
                // TODO remove cookie, redirect
                return
            } catch (e) {
            }
        }),
        updateUserSettings: authenticate(async (_, args: Partial<Settings>, ctx) => {
            try {
                // FIXME this will overwrite entire settings block--submit all every update?
                return await ctx.prisma.user.update({
                    where: {
                        id: ctx.user.id
                    },
                    data: { settings: args }
                })
                // update cookie/localStorage, current entry
            } catch (e) {
            }
        }),
        updateUserEmail: authenticate(async (_, { email }: { email: string }, ctx): Promise<User> => {
            try {
                return await ctx.prisma.user.update({
                    where: {
                        id: ctx.user.id
                    },
                    data: { email }
                })
            } catch (e) {
            }
        }),
        updateUserPassword: authenticate(async (_, args: { oldPassword: string, newPassword: string }, ctx): Promise<User> => {
            try {
                // TODO passsword hashing
                const hashedPassword = args.oldPassword
                if (ctx.user.password == hashedPassword) {
                    return await ctx.prisma.user.update({
                        where: {
                            id: ctx.user.id
                        },
                        data: { password: args.newPassword }
                    })
                }
            } catch (e) {
            }
        }),
        findOrCreateEntry: authenticate(async (_, args: { date: string, timezone: string }, ctx): Promise<Entry> => {
            // FIXME  ugly conditional
            try {
                const entry = await ctx.prisma.entry.findUnique({
                    where: {
                        date: args.date,
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
                if (!entry) {
                    return await ctx.prisma.entry.create({ data: {
                        date: args.date,
                        timezone: args.timezone,
                        User: {
                            id: ctx.user.id
                        }
                    }})
                }
                return entry
            } catch (e) {
            }
        }),
        // TEST -- to replace all log and entry create/update functions
        
        createOrUpdateEntry: authenticate(async (_, { date, timezone, activity }, ctx): Promise<Entry> => {
            try {
                const entry = ctx.prisma.entry.upsert({
                    where: {
                        date,
                        userId: ctx.user.id
                    },
                    update: {
                        timezone,
                        dayEndsAt: ctx.user.settings.dayEndsAt,
                        updatedAt: Date.now()
                    },
                    create: {
                        date,
                        timezone,
                        dayEndsAt: ctx.user.settings.dayEndsAt,
                        userId: ctx.user.id
                    }
                })
                // TODO upsert activity log?
                return entry
            } catch (e) {
            }
        }),
        //
        createLog: authenticate(async (_, args, ctx): Promise<ActivityLog> => {
            // TODO
            try {
                return ctx.prisma.activityLog.create({
                })
            } catch (e) {
            }
        }),
        updateOrCreateLog: authenticate(async (_, args, ctx): Promise<ActivityLog> => {
            try {
                async function getRecentLog () {
                    if (args.logId) {
                        return await ctx.prisma.activityLog.findUnique({
                            wnere: {
                                id: args.logId
                            }
                        })
                    } else {
                        return await ctx.prisma.activityLog.findFirst({
                            where: {
                                userId: ctx.user.id,
                                date: args.date
                            }
                        })
                    }
                }
                const now = new Date()
                const recentLog = await getRecentLog()
                function minutesAgo(prev: Date): number {
                    const now = new Date()
                    return Math.floor(((now - prev) / 1000) / 60)
                }
                if (recentLog && (minutesAgo(recentLog.updatedAt) < 5)) {
                    return await ctx.prisma.activityLog.update({
                        where: {
                            id: recentLog.id
                        },
                        data: {
                            updatedAt: now,
                            content: args.content,
                            wordCount: args.wordCount,
                            lowestWordCount: args.lowestWordCount
                        }
                    })
                } else {
                    return await ctx.prisma.activityLog.create{
                        data: {
                            userId: ctx.user.id,
                            createdAt: args.start,
                            updatedAt: now,
                            content: args.content,
                            wordCount: args.wordCount,
                            lowestWordCount: args.lowestWordCount
                        }
                    }
                }
            } catch (e) {
            }
        }),
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
                        id: entryId,
                        User: {
                            id: ctx.user.id
                        }
                    },
                    data: {
                        tags: {
                            connectOrCreate: {
                                where: {
                                    name: tagName
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
                        id: entryId
                    },
                    data: {
                        tags: {
                            disconnect: [{ id: tagId }]
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
    User: {
        entries: async (user, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        tags: async (user, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    },
    Entry: {
        user: async (entry, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        activityLogs: async (entry, {}, ctx) => {
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
    },
    ActivityLog: {
        entry: async (activityLog, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
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
