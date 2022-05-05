import bcrypt from 'bcrypt'
import { User } from 'shared/types'

const SALT_ROUNDS = 10

export const validatePassword = async (
  user: User, enteredPassword: string) => {
    return await bcrypt.compare(
      enteredPassword, user.password)
}

export const encryptPassword = async (password: string) => {
  const hash = await bcrypt.hash(
    password, SALT_ROUNDS)
  if (hash) return hash
  throw new Error('password was not saved')
}
