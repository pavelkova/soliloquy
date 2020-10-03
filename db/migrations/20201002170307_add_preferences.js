
exports.up = function(knex) {
    return knex.schema.createTable('user_preferences', function(table) {
        table.increments('id').primary().notNullable()
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
        table.string('font_name')
        table.string('font_size')
        table.string('theme')
        table.string('background_color')
        table.string('text_color')
        table.string('highlight_color')
        table.string('timezone')
        table.integer('word_count_goal').defaultTo(750)

    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_preferences')
};
