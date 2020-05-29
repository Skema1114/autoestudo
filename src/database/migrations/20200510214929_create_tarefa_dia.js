
exports.up = function (knex) {
  return knex.schema.createTable('tarefa_dia', function (table) {
    table.increments('id').primary();

    table.integer('id_tarefa').notNullable();
    //table.foreign('id_tarefa').references('id').inTable('tarefa');

    table.integer('id_usuario').notNullable();
    //table.foreign('id_usuario').references('id').inTable('usuario');

    table.integer('dia').notNullable();
    table.integer('mes').notNullable();
    table.string('status').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tarefa_dia');
};