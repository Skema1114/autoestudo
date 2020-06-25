
exports.up = async function (knex) {
  return knex.schema.createTable('tarefa_dia', function (table) {
    table.increments('id').primary().primary().unsigned().notNullable();

    table.integer('id_tarefa').unsigned().notNullable().references('id').inTable('tarefa').onDelete('CASCADE').index();
    table.integer('id_usuario').unsigned().notNullable().references('id').inTable('usuario').onDelete('CASCADE').index();
    table.integer('id_dia').unsigned().notNullable().references('id').inTable('dia').onDelete('CASCADE').index();
    table.string('status').notNullable();
    table.string('data_cadastro').notNullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('tarefa_dia');
};