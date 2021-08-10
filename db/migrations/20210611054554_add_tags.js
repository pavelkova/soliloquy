exports.up = function (knex) {
  return knex.schema.createTable('tags', function (table) {
    table.increments('id').primary().notNullable()
    table
         .integer('parent_id')
         .unsigned()
         .references('id')
         .inTable('tags')
         .onDelete('cascade')
    table.text('name')
    table.integer('depth').notNullable().defaultTo(0)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('tags')
}
