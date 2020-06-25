
exports.up = async function (knex) {
  return knex.schema.createTable('resultado_mes', function (table) {
    table.increments('id').primary().primary().unsigned().notNullable();

    table.integer('id_usuario').unsigned().notNullable().references('id').inTable('usuario').onDelete('CASCADE').index();
    table.integer('id_mes').unsigned().notNullable().references('id').inTable('mes').onDelete('CASCADE').index();

    table.string('resultado').notNullable();
    table.string('data_cadastro').notNullable();
    table.string('bloq');
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('resultado_mes');
};