const connection = require('../database/connection');

module.exports = {
    async get(request, response){
        const id_usuario = request.headers.authorization;

        const tarefa_meses = await connection('tarefa_mes')
        .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
        .select([
            'tarefa_mes.*',
            'tarefa.nome',   
        ])
        .where('tarefa_mes.id_usuario', id_usuario);

        if (tarefa_meses.length > 0) {
            const [count] = await connection('tarefa_mes')
            .count()
            .where('id_usuario', id_usuario);

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(tarefa_meses);
    },

    async post(request, response){
        const {id_tarefa, mes, ano, qtd_nao, data_cadastro, bloq} = request.body;
        const id_usuario = request.headers.authorization;

        const [id] = await connection("tarefa_mes").insert({
            id_usuario,
            id_tarefa,
            mes,
            ano,
            qtd_nao,
            data_cadastro,
            bloq
        });

        return response.json({id});
    },

    async patch(request, response) {
        const {id} = request.params;
        const id_usuario = request.headers.authorization;
        const tarefaMesBody = request.body;
              
        const tarefaMes = await connection('tarefa_mes')
            .where('id', id)
            .andWhere('id_usuario', id_usuario)
            .update(tarefaMesBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({msg: error.message})
            })
    },

    async delete(request, response){
        const {id} = request.params;
        const id_usuario = request.headers.authorization;

        const tarefa_meses = await connection('tarefa_mes')
            .where('id', id)
            .select('id_usuario')
            .first()

    if((tarefa_meses.id_usuario !== id_usuario)&&(tarefa_meses.id_tarefa !== id)){
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
        await connection('tarefa_mes').where('id', id).delete();

        return response.status(204).send();
    },

    async getTarefaMesByMesAno(request, response){
        const {mes, ano} = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
        .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
        .select([
            'tarefa_mes.*',
            'tarefa.nome',
        ])
        .where('tarefa_mes.id_usuario', id_usuario)
        .andWhere('tarefa_mes.mes', mes)
        .andWhere('tarefa_mes.ano', ano);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .count()
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.mes', mes)
            .andWhere('tarefa_mes.ano', ano);

            response.header('X-Total-Count', count['count(*)']);
        
            return response.json(tarefa_mes);
        } else {
            response.header('X-Total-Count', 0);
        
            return response.status(401).json({
                error: 'Não há dados associados à data informada'
            });
        }
    },

    async getTarefaMesBloqByMesAno(request, response){
        const {mes, ano} = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
        .select([
            'tarefa_mes.bloq',
        ])
        .where('tarefa_mes.id_usuario', id_usuario)
        .andWhere('tarefa_mes.mes', mes)
        .andWhere('tarefa_mes.ano', ano);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
            .count()
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.mes', mes)
            .andWhere('tarefa_mes.ano', ano);

            response.header('X-Total-Count', count['count(*)']);
        
            return response.json(tarefa_mes);
        } else {
            response.header('X-Total-Count', 0);
        
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },

    async getTarefaMesById(request, response){
        const {id} = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
        .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
        .select([
            'tarefa_mes.*',
            'tarefa.nome',
        ])
        .where('tarefa_mes.id_usuario', id_usuario)
        .andWhere('tarefa_mes.id', id);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .count()
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.id', id);

            response.header('X-Total-Count', count['count(*)']);
        
            return response.json(tarefa_mes);
        } else {
            response.header('X-Total-Count', 0);
        
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },

    async getTarefaMesBloqById(request, response){
        const {id} = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
        .select([
            'tarefa_mes.bloq',
        ])
        .where('tarefa_mes.id_usuario', id_usuario)
        .andWhere('tarefa_mes.id', id);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
            .count()
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.id', id);

            response.header('X-Total-Count', count['count(*)']);
        
            return response.json(tarefa_mes);
        } else {
            response.header('X-Total-Count', 0);
        
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },
};