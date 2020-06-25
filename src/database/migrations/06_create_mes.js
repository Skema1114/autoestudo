
exports.up = async function (knex) {
  return knex.schema.createTable('mes', function (table) {
    table.increments('id').primary().primary().unsigned().notNullable();

    table.integer('mes').notNullable();
    table.integer('ano').notNullable();
    table.integer('qtd_nao').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
}

exports.down = async function (knex) {
  return knex.schema.dropTable('mes');
}
