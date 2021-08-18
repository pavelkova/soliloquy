
exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', function(table) {
    table.increments('id').primary().notNullable()
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade')
    table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
    table.text('content')
    table.timestamp('start').notNullable()
    table.timestamp('end')
    table.integer('word_count')
    table.unique(['entry_id', 'start'])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('activity_logs')
};
