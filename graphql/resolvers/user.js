import { userService } from 'services/user'
import { entryService } from 'services/entry'

const { findById, findByEmail, login, signup } = userService()
const { findAll } = entryService()

export default {
  Query: {
    currentUser: async (_, { user }, context) => {
      if (user) {
        return await findById(user)
      }
      throw new Error(errors.login.notLoggedIn)
    },
    findUserById: async (_, { id }) => {
      return await findById(id)
    },
    findUserByEmail: async (_, { email }, context) => {
      return await findByEmail(email)
    },
  },
  Mutation: {
    signup: async (_, { email, password }, context) => {
      return await signup(email, password)
    },
    login: async (_, { email, password }, context) => {
      return await login(email, password)
    },
  },
  User: {
    entries: async (user, {}, context) => {
      return await findAll(user)
    }
  }
}



const errors = {
  signup: {
    userExists: 'A user with this email address already exists.',
  },
  login: {
    incorrect:
      'The email or password you entered is incorrect. Please check your credentials.',
    notLoggedIn: 'Please log in to continue.',
  },
}
