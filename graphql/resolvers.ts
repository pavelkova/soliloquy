const resolvers = {
    Query: {
        findUserByEmail: {},
        findEntryByDate: {},
        findEntriesByDateSpan: {},
        findAllEntries: {},
        findAllActivityLogs: {},
    },
    Mutation: {
        signup: {},
        login: {},
        logout: {},
        updateUser: {},
        createOrUpdateEntry: {},
        createOrUpdateLog: {},
        createTag: {},
        updateTag: {},
        toggleTagOnEntry: {},
        deleteTag: {}
    }
}
