
exports.up = function (knex) {
  return knex.schema.createTable('resultado_mes', function (table) {
    table.increments('id').primary();

    table.integer('id_usuario').notNullable();
    //table.foreign('id_usuario').references('id').inTable('usuario');

    table.integer('mes').notNullable();
    table.string('resultado').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('resultado_mes');
};