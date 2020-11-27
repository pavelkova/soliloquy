
exports.up = function(knex) {
  return knex.schema.createTable('settings', function(table) {
    table.increments('id').primary().notNullable()
    table.string('key').notNullable()
    table.string('value')
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings')
};
