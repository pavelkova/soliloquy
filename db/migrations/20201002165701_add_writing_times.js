
exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', function(table) {
    table.increments('id').primary().notNullable()
    table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
    table.text('content')
    table.integer('word_count')
    table.timestamps(true, false)
    table.unique(['entry_id', 'created_at'])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('activity_logs')
};
