

exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary().notNullable()
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
      table.timestamps().defaultTo(knex.fn.now())
      table.jsonb('preferences')
    })

};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
