import knex from 'knex'
import knexfile from './knexfile'

export const db = knex(knexfile.development)

export const selectData = (
    tableName,
    options = { fields: [], filteringConditions: [] }
) => {
  const { fields, filteringConditions } = options

  return db(tableName)
    .select(fields)
    .where((builder) => {
      filteringConditions.forEach((condition) => {
        builder.where(...condition)
      })
    })
    .then((data) => data)
    .finally(() => db.destroy())
}

export const insertData = (tableName, data) => {
  return db(tableName)
    .insert(data)
    .then((resp) => resp)
    .finally(() => db.destroy())
}

export const updateData = (
  tableName,
  options = { fields: {}, filteringConditions: [] }
) => {
  const { fields, filteringConditions } = options

  return db(tableName)
    .where((builder) => {
      filteringConditions.forEach((condition) => {
        builder.where(...condition)
      })
    })
    .update(fields)
    .then((data) => data)
    .finally(() => db.destroy())
}

export const deleteData = (tableName, options = { filteringConditions: [] }) => {
  const { filteringConditions } = options

  return db(tableName)
    .where((builder) => {
      filteringConditions.forEach((condition) => {
        builder.where(...condition)
      })
    })
    .del()
    .then((data) => data)
    .finally(() => db.destroy())
}
