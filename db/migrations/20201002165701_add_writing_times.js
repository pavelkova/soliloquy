
exports.up = function(knex) {
    return knex.schema.createTable('writing_time_logs', function(table) {
        table.increments('id').primary().notNullable()
        table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
        table.datetime('start_time').defaultTo(knex.fn.now())
        table.datetime('end_time').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('writing_time_logs')
};
