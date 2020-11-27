exports.up = function (knex) {
  return knex.schema.createTable('entries', function (table) {
    table.increments('id').primary().unique().notNullable()
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
    table.date('date').notNullable()
    table.text('content')
    table.text('timezone')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('entries')
}
