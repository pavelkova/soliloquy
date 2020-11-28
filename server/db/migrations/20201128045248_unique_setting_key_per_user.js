
exports.up = function(knex) {
  return knex.schema.alterTable('settings', function (table) {
    table.unique(['user_id', 'key'])
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('settings', function (table) {
    table.dropUnique(['user_id', 'key'])
  })
};
