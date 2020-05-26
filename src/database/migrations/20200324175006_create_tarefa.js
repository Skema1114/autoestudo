
exports.up = function(knex) {
    return knex.schema.createTable('tarefa', function (table) {
        table.increments();
        
        table.integer('id_usuario').notNullable();
        table.foreign('id_usuario').references('id').inTable('usuario');

        table.string('nome').notNullable();
        table.string('data_cadastro').notNullable();     
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tarefa');
};
