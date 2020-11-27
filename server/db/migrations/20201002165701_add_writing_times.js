
exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', function(table) {
    table.increments('id').primary().notNullable()
    table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
    table.text('content')
    table.timestamp('start')
    table.timestamp('end')
    table.integer('lowest_word_count')
    table.integer('net_word_count')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('activity_logs')
};
