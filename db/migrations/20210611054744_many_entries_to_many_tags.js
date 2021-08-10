exports.up = function (knex) {
  return knex.schema.createTable('entry_tags', function (table) {
    table.increments('id').primary().notNullable()
    table
      .integer('entry_id')
      .notNullable()
      .references('id')
      .inTable('entries')
      .onDelete('cascade')
    table
      .integer('tag_id')
      .notNullable()
      .references('id')
      .inTable('tags')
      .onDelete('cascade')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('entry_tags')
}
