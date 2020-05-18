const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const id_usuario = request.headers.authorization;

        const meses = await connection('mes')
        .select('*')
        .where('id_usuario', id_usuario);

        if (meses.length > 0) {
            const [count] = await connection('mes')
            .count();

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(meses);
    },

    async create(request, response){
        const {mes, ano, qtd_nao} = request.body;
        const id_usuario = request.headers.authorization;

        const [id] = await connection("mes").insert({
            id_usuario,
            mes,
            ano,
            qtd_nao
        });

        return response.json({id});
    },

    async delete(request, response){
        const {id} = request.params;
        const id_usuario = request.headers.authorization;

        const tarefas = await connection('mes')
            .where('id', id)
            .select('id_usuario')
            .first()

    if(tarefas.id_usuario !== id_usuario){
            return response.status(401).json({
                error: 'Operation not permitted.'
            });
        }
        await connection('mes').where('id', id).delete();

        return response.status(204).send();
    }
};