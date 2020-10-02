const resolvers = {
    Query: {
        user: () => {},
        entry: (_, { userId, entryDate }) => {},
        entries: (_, { userId }) => {}
    },
    Mutation: {
        signup: async (_, { email, password }) => {},
        login: async (_, { email, password }) => {},
        createEntry: async (_, { userId, content, entryDate }) => {},
        updateEntry: async (_, { userId, content, entryDate }) => {}
    }
}

/**
   entry: autosave at interval,
   if idle for 2 minutes or tab close, push start & last saved times to array like [(start_time, end_time), (start_time, end_time)]; number of breaks = array length - 1, active typing time = (end_time - start_time) + (end_time - start_time), total time = time[-1][end_time] - time[0][start_time]
   on autosave: time[-1][end_time] = current_time;
   at autosave time:
   if no change has been made, return
   if current_time - time[-1][end_time] > 5 min, push new tuple to time array like [(start_time, end_time), (current_time, current_time)]
   useState last typed time -> update with each new word count
**/
