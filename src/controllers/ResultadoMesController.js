const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const id_usuario = request.headers.authorization;

        const resultado_meses = await connection('resultado_mes')
        .select('*')
        .where('id_usuario', id_usuario);

        if (resultado_meses.length > 0) {
            const [count] = await connection('resultado_mes')
            .count();

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(resultado_meses);
    },

    async create(request, response){
        const {resultado} = request.body;
        const id_usuario = request.headers.authorization;
        const {id_mes} = request.params;

        const [id] = await connection("resultado_mes").insert({
            id_mes,
            id_usuario,
            resultado
        });

        return response.json({id});
    },

    async delete(request, response){
        const {id} = request.params;
        const id_usuario = request.headers.authorization;

        const resultado_meses = await connection('resultado_mes')
            .where('id', id)
            .select('id_usuario')
            .first()

    if((resultado_meses.id_usuario !== id_usuario)&&(resultado_meses.id !== id)){
            return response.status(401).json({
                error: 'Operation not permitted.'
            });
        }
        await connection('resultado_mes').where('id', id).delete();

        return response.status(204).send();
    }
};