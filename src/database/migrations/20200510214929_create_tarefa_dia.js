
exports.up = function(knex) {
  return knex.schema.createTable('tarefa_dia', function (table) {
      table.increments();

      table.string('id_tarefa').notNullable();
      table.foreign('id_tarefa').references('id').inTable('tarefa');
      
      table.string('id_usuario').notNullable();
      table.foreign('id_usuario').references('id').inTable('usuario');

      table.string('status').notNullable();
      
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tarefa_dia');
};