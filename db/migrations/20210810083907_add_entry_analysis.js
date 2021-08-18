
exports.up = function(knex) {
  return knex.schema.createTable('entry_analysis', function (table) {
    table.increments('id').primary().notNullable()
    table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
    table.enu('activity_type', ['WRITE', 'EDIT']).notNullable().defaultTo('WRITE')
    table.integer('activity_log_id').unsigned().notNullable().references('id').inTable('activity_logs').onDelete('cascade')
    table.timestamps(true, true)
    table.unique('entry_id', 'activity_type')
  })
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('entry_analysis')
};
