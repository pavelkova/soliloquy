
exports.up = function(knex) {
    return knex.schema.createTable('entries', function(table) {
        table.increments('id').primary().notNullable()
        table.text('content')
        table.string('title_date')
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
        table.timestamps().defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('entries')
};
