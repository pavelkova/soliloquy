
exports.up = function(knex) {
  return knex.schema.table('entries', function(table) {
      table.renameColumn('userId', 'user_id')
  })
};

exports.down = function(knex) {
  return knex.schema.table('entries', function(table) {
      table.renameColumn('user_id', 'userId')
  })
};
