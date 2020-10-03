
exports.up = function(knex) {
    return knex.schema.table('entries', function(table) {
        table.date('entry_date')
    })
  
};

exports.down = function(knex) {
    return knex.schema.table('entries', function(table) {
        table.dropColumn('entry_date')
    })
  
};
