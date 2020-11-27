

exports.up = function(knex) {
  return knex.schema.alterTable('entries', function (table) {
    table.unique(['user_id', 'date'])
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('entries', function (table) {
    table.dropUnique(['user_id', 'date'])
  })
};
