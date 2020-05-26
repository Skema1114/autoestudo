const connection = require('../database/connection');

module.exports = {
    async get(request, response){
        const id_usuario = request.headers.authorization;

        const resultado_dias = await connection('resultado_dia')
        .select('*')
        .where('id_usuario', id_usuario);

        if (resultado_dias.length > 0) {
            const [count] = await connection('resultado_dia')
            .count()
            .where('id_usuario', id_usuario);

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(resultado_dias);
    },

    async post(request, response){
        const {dia, resultado, qtd_nao, data_cadastro} = request.body;
        const id_usuario = request.headers.authorization;

        const [id] = await connection("resultado_dia").insert({
            id_usuario,
            dia,
            resultado,
            qtd_nao,
            data_cadastro
        });

        return response.json({id});
    },

    async patch(request, response) {
        const {id} = request.params;
        const id_usuario = request.headers.authorization;
        const resultadoDiaBody = request.body;

        const resultadoDiaTeste = await connection('resultado_dia')
            .where('id', id)
            .select('id_usuario')
            .first()

        if(resultadoDiaTeste.id_usuario !== id_usuario){
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
              
        const resultadoDia = await connection('resultado_dia')
            .where('id', id)
            .andWhere('id_usuario', id_usuario)
            .update(resultadoDiaBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({msg: error.message})
            })
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
                error: 'Sem permissões'
            });
        }
        await connection('resultado_dia').where('id', id).delete();

        return response.status(204).send();
    }
};