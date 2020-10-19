import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const validatePassword = async (
  user, enteredPassword) => {
    return await bcrypt.compare(
      enteredPassword, user.password)
}

export const encryptPassword = async password => {
  const hash = await bcrypt.hash(
    password, SALT_ROUNDS)
  if (hash) return hash
  throw new Error('password was not saved')
}
