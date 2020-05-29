
exports.up = function (knex) {
  return knex.schema.createTable('usuario', function (table) {
    table.increments('id').primary();

    table.string('token').notNullable();
    //table.string('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable();
    //table.string('email').notNullable().unique();
    table.string('senha').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usuario');
};
