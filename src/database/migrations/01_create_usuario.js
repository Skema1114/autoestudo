
exports.up = async function (knex) {
  return knex.schema.createTable('usuario', function (table) {
    table.increments('id').primary().unsigned().notNullable();

    table.string('token').notNullable();
    table.string('nome').notNullable();
    table.string('email').notNullable();
    table.string('senha').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('usuario');
};
