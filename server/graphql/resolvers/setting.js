import { authenticate } from 'services/auth'
import { findByName, findAll,
         create, update } from 'actions/setting'
import { findById as findSettingOwner } from 'actions/user'

export default {
  Query: {
    findSettingByName: authenticate(
      async (_, { key }, ctx) => {
        return await findByName(ctx.user, key)
    }),
    findAllSettings: authenticate(
      async (_, {}, ctx) => {
        return await findAll(ctx.user)
    })
  },
  Mutation: {
    /* createSetting: authenticate(
     *   async (_, { key, value }, ctx) => {
     *     return await create(ctx.user, key, value)
     * }), */
    updateSetting: authenticate(
      async (_, { id, key, value }, ctx) => {
        return await update(ctx.user, id, key, value)
    })
  },
  Setting: {
    user: async (setting, {}, ctx) => {
      return await findSettingOwner(setting.userId)
    }
  }
}
