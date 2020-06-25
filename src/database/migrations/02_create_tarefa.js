
exports.up = async function (knex) {
    return knex.schema.createTable('tarefa', function (table) {
        table.increments('id').primary().unsigned().notNullable();

        table.integer('id_usuario').unsigned().notNullable().references('id').inTable('usuario').onDelete('CASCADE').index();

        table.string('nome').notNullable();
        table.string('data_cadastro').notNullable();
        table.string('bloq');
    });
};

exports.down = async function (knex) {
    return knex.schema.dropTable('tarefa');
};
