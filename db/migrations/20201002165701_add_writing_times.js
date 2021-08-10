
exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', function(table) {
    table.increments('id').primary().notNullable()
    table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
    table.enu('activity_type', ['WRITE', 'EDIT']).notNullable().defaultTo('WRITE')
    table.text('content')
    table.timestamp('start').notNullable()
    table.timestamp('end')
    table.integer('lowest_word_count').notNullable().defaultTo(0)
    table.integer('word_count')
    table.unique(['entry_id', 'start'])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('activity_logs')
};
