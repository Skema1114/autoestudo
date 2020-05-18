const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const id_usuario = request.headers.authorization;

        const resultado_dias = await connection('resultado_dia')
        .select('*')
        .where('id_usuario', id_usuario);

        if (resultado_dias.length > 0) {
            const [count] = await connection('resultado_dia')
            .count();

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(resultado_dias);
    },

    async create(request, response){
        const {resultado, qtd_nao} = request.body;
        const id_usuario = request.headers.authorization;
        const {id_dia} = request.params;

        const [id] = await connection("resultado_dia").insert({
            id_dia,
            id_usuario,
            resultado,
            qtd_nao
        });

        return response.json({id});
    },

    async delete(request, response){
        const {id} = request.params;
        const id_usuario = request.headers.authorization;

        const resultado_dias = await connection('resultado_dia')
            .where('id', id)
            .select('id_usuario')
            .first()

    if((resultado_dias.id_usuario !== id_usuario)&&(resultado_dias.id !== id)){
            return response.status(401).json({
                error: 'Operation not permitted.'
            });
        }
        await connection('resultado_dia').where('id', id).delete();

        return response.status(204).send();
    }
};