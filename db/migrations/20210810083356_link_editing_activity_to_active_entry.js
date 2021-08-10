
exports.up = function(knex) {
  return knex.schema.createTable('entry_editing_logs', function (table) {
    table.increments('id').primary().notNullable()
    table.integer('active_entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
    table.integer('editing_activity_log_id').unsigned().notNullable().references('id').inTable('activity_logs').onDelete('cascade')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('entry_editing_logs')
};
