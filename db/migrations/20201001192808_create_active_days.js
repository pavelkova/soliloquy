exports.up = function(knex) {
  return knex.schema.createTable('active_days', function(table) {
    table.increments('id').primary().unique().notNullable()
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
    table.date('date').notNullable()
    table.text('timezone').notNullable()
    table.float('day_starts_at').defaultTo(0)
    table.unique(['user_id', 'date'])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('active_days')
};
