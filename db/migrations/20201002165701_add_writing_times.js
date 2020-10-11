
exports.up = function(knex) {
    return knex.schema.createTable('activity_logs', function(table) {
        table.increments('id').primary().notNullable()
        table.integer('entry_id').unsigned().notNullable().references('id').inTable('entries').onDelete('cascade')
        table.text('content')
        table.datetime('start_time').defaultTo(knex.fn.now())
        table.datetime('end_time')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('activity_logs')
};
