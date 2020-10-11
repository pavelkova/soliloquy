import knex from 'knex'
import knexfile from './knexfile'

export const db = knex(knexfile)

export const fieldAs = (snake, camel) => {
  console.log(snake, camel)
  /* return knex.ref(snake).as(camel) */
  return snake + ' as ' + camel
}
