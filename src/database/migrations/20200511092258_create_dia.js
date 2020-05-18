
exports.up = function(knex) {
  return knex.schema.createTable('dia', function (table) {
      table.increments();
      
      table.string('id_usuario').notNullable();
      table.foreign('id_usuario').references('id').inTable('usuario');

      table.string('id_mes').notNullable();
      table.foreign('id_mes').references('id').inTable('mes');

      table.string('data').notNullable();

      
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('dia');
};
