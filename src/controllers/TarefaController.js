const connection = require('../database/connection');

module.exports = {
    async get(request, response){
        const id_usuario = request.headers.authorization;

        const tarefas = await connection('tarefa')
        .select('*')
        .where('id_usuario', id_usuario);

        if (tarefas.length > 0) {
            const [count] = await connection('tarefa')
            .count()
            .where('id_usuario', id_usuario);

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(tarefas);
    },

    async patch(request, response) {
        const {id} = request.params;
        const id_usuario = request.headers.authorization;
        const tarefaBody = request.body;

        const tarefasTeste = await connection('tarefa')
            .where('id', id)
            .select('id_usuario')
            .first()

        if(tarefasTeste.id_usuario !== id_usuario){
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
              
        const tarefas = await connection('tarefa')
            .where('id', id)
            .andWhere('id_usuario', id_usuario)
            .update(tarefaBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({msg: error.message})
            })
    },
/*
    async put(request, response) {
        const {id} = request.params;
        const id_usuario = request.headers.authorization;
        const {nome} = request.body;

        const tarefasTeste = await connection('tarefa')
            .where('id', id)
            .select('id_usuario')
            .first()

        if(tarefasTeste.id_usuario !== id_usuario){
            return response.status(401).json({
                error: 'Sem permissões.'
            });
        }
              
        const tarefas = await connection('tarefa')
            .where('id', id)
            .andWhere('id_usuario', id_usuario)
            .update({
                nome: nome || null
            })
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({msg: error.message})
            })
    },
*/    
    async post(request, response){
        const {nome, data_cadastro} = request.body;
        const id_usuario = request.headers.authorization;

        const [id] = await connection("tarefa").insert({
            id_usuario,
            nome,
            data_cadastro
        });

        return response.json({id});
    },

    async delete(request, response){
        const {id} = request.params;
        const id_usuario = request.headers.authorization;

        const tarefas = await connection('tarefa')
            .where('id', id)
            .select('id_usuario')
            .first()

        if(tarefas.id_usuario !== id_usuario){
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
        await connection('tarefa').where('id', id).delete();

        return response.status(204).send();
    }
};
