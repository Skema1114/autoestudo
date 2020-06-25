
exports.up = async function (knex) {
  return knex.schema.createTable('resultado_dia', function (table) {
    table.increments('id').primary().primary().unsigned().notNullable();

    table.integer('id_usuario').unsigned().notNullable().references('id').inTable('usuario').onDelete('CASCADE').index();
    table.integer('id_dia').unsigned().notNullable().references('id').inTable('dia').onDelete('CASCADE').index();

    table.string('resultado').notNullable();
    table.integer('qtd_nao').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('resultado_dia');
};