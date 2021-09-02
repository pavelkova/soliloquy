exports.up = function (knex) {
  return knex.schema.createTable('tags', function (table) {
    table.increments('id').primary().notNullable()
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade')
    table.integer('parent_id').unsigned().references('id').inTable('tags').onDelete('cascade')
    table.text('name')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.unique(['user_id', 'parent_id', 'name'])
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('tags')
}
