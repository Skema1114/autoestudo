
exports.up = function(knex) {
  return knex.schema.createTable('resultado_dia', function (table) {
      table.increments();

      table.integer('id_usuario').notNullable();
      table.foreign('id_usuario').references('id').inTable('usuario');
      
      table.integer('dia').notNullable();
      table.string('resultado').notNullable();
      table.integer('qtd_nao').notNullable();
      table.string('data_cadastro').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('resultado_dia');
};