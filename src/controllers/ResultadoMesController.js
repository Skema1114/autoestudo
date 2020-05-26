const connection = require('../database/connection');

module.exports = {
    async get(request, response){
        const id_usuario = request.headers.authorization;

        const resultado_meses = await connection('resultado_mes')
        .select('*')
        .where('id_usuario', id_usuario);

        if (resultado_meses.length > 0) {
            const [count] = await connection('resultado_mes')
            .count()
            .where('id_usuario', id_usuario);

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(resultado_meses);
    },

    async post(request, response){
        const {mes, resultado, data_cadastro} = request.body;
        const id_usuario = request.headers.authorization;

        const [id] = await connection("resultado_mes").insert({
            id_usuario,
            mes,
            resultado,
            data_cadastro
        });

        return response.json({id});
    },

    async patch(request, response) {
        const {id} = request.params;
        const id_usuario = request.headers.authorization;
        const resultadoMesBody = request.body;

        const resultadoMesTeste = await connection('resultado_mes')
            .where('id', id)
            .select('id_usuario')
            .first()

        if(resultadoMesTeste.id_usuario !== id_usuario){
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
              
        const resultadoMes = await connection('resultado_mes')
            .where('id', id)
            .andWhere('id_usuario', id_usuario)
            .update(resultadoMesBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({msg: error.message})
            })
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
                error: 'Sem permissões'
            });
        }
        await connection('resultado_mes').where('id', id).delete();

        return response.status(204).send();
    }
};