import { IResolvers } from 'graphql-tools'

const resolvers: IResolvers = {
    Query: {
    },
    Mutation: {
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
        })
    },
    ActivityLog: {
        entry: async (activityLog, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    }
}
