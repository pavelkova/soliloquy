import knex from 'knex'
import knexfile from 'db/knexfile'

export default {
    Query: {
        user: (_, { email }) => {},
        entry: (_, { userId, entryDate }) => {},
        entries: (_, { userId }) => {},
        preferences: (_, { userId }) => {}
    },
    Mutation: {
        signup: async (_, { email, password }) => {},
        login: async (_, { email, password }) => {},
        createEntry: async (_, { userId, content, entryDate }) => {},
        updateEntry: async (_, { userId, content, entryDate }) => {},
        createTimeLog: async(_, { entryId, startTime, endTime }) => {},
        updatePreferences: async(_, { userId, ...args }) => {},
        updateTimeLog: async (_, { id, endTime}) => {}
    }
}

const path = require('path');
const { mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');

const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));

module.exports = mergeResolvers(resolversArray)
