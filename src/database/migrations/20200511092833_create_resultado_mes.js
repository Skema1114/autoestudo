
exports.up = function(knex) {
  return knex.schema.createTable('resultado_mes', function (table) {
      table.increments();
      
      table.string('id_mes').notNullable();
      table.foreign('id_mes').references('id').inTable('mes');

      table.string('id_usuario').notNullable();
      table.foreign('id_usuario').references('id').inTable('usuario');

      table.string('resultado').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('resultado_mes');
};