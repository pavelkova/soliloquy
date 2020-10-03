
exports.up = function(knex) {
    return knex.schema.createTable('entries', function(table) {
        table.increments('id').primary().notNullable()
        table.text('content')
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
        table.timestamps()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('entries')
};
