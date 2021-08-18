exports.up = function (knex) {
  return knex.schema.createTable('entries', function (table) {
    table.increments('id').primary().unique().notNullable()
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
    table.date('date').notNullable()
    table.text('timezone').notNullable()
    table.float('day_starts_at').defaultTo(0)
    table.timestamps(true, true)
    table.unique(['user_id', 'date'])
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('entries')
}
