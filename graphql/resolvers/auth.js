import knex from 'knex'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from 'db/helpers'

cont JWT_SECRET = 'test'

export default {
    Query: {
        user: (_, { email }) => {},
        current: async (_, args, { user }) {
            if (user) {
                return db
                    .select('*')
                    .from('users')
                    .where({ where: { id: user.id }})
                    .first()
            }
            throw new Error(errors.login.notLoggedIn)
        }
    },
    Mutation: {
        signup: async (_, { email, password }) => {
            const user = await checkUser(email)

            if (user) {
                throw new Error(errors.signup.userExists)
            }

            user = await User.create({
                email,
                password: await bcrypt.hash(password, 10)
            })

            return generateToken(user)
        },
        login: async (_, { email, password }) => {
            const user = await checkUser(email)
            const isValid = await bcrypt.compare(password, user.password)

            if (!user || !isValid) {
                throw new Error(errors.login.incorrect)
            }

            return generateToken(user)
        },
    }
}

const errors = {
    signup: {
        userExists: 'A user with this email address already exists.'
    },
    login: {
        incorrect: 'The email or password you entered is incorrect. Please check your credentials.',
        notLoggedIn: 'Please log in to continue.'
    }
}

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, JWT_SECRET, {
        expiresIn: '3m'
    })
}

async function checkUser(email) {
    return await User.findOne({ where: { email }})
}
