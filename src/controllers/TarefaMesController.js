const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
    // ATUALIZADO PARA ULTIMA VERSÃO
    async get(request, response) {
        const id_usuario = request.headers.authorization;

        const tarefa_meses = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
            .select([
                'tarefa_mes.id', 'tarefa_mes.id_tarefa', 'tarefa_mes.id_mes',
                'mes.mes', 'mes.ano', 'mes.qtd_nao', 'mes.bloq',
                'tarefa.nome',
                'tarefa_mes.data_cadastro'
            ])
            .where('tarefa_mes.id_usuario', id_usuario)
            .orderBy('mes.mes');

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

    // ATUALIZADO PARA ULTIMA VERSÃO
    async post(request, response) {
        const { tarefas, mes, ano, qtd_nao } = request.body;
        const id_usuario = request.headers.authorization;
        const data_cadastro = moment().utcOffset('-03:00').format("DD/MM/YYYY HH:mm:ss");
        const bloq = 'nao';
        const trx = await connection.transaction();

        const mesData = {
            mes,
            ano,
            qtd_nao,
            data_cadastro,
            bloq
        }

        const insertedIds = await trx("mes").insert(mesData);
        const mes_id = insertedIds[0];

        const tarefaMesData = tarefas.map((tarefa_id) => {
            return {
                id_tarefa: tarefa_id,
                id_usuario,
                id_mes: mes_id,
                data_cadastro
            }
        })

        await trx("tarefa_mes").insert(tarefaMesData);

        await trx.commit()
            .then(result => response.sendStatus(204))
            .catch(error => response.status(412).json({ msg: error.message }));
    },

    // --> NAO TESTADO <-- ATUALIZADO PARA ULTIMA VERSÃO
    async patch(request, response) {
        const { id } = request.params;
        const id_usuario = request.headers.authorization;
        const tarefaMesBody = request.body;

        const tarefaMes = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.id', id)
            .update(tarefaMesBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({ msg: error.message })
            })
    },

    async delete(request, response) {
        const { id } = request.params;
        const id_usuario = request.headers.authorization;

        const tarefa_meses = await connection('tarefa_mes')
            .where('id', id)
            .select('id_usuario')
            .first()

        if ((tarefa_meses.id_usuario !== id_usuario) && (tarefa_meses.id_tarefa !== id)) {
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
        await connection('tarefa_mes').where('id', id).delete();

        return response.status(204).send();
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaMesByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
            .select([
                'tarefa_mes.id', 'tarefa_mes.id_tarefa', 'tarefa_mes.id_mes',
                'mes.mes', 'mes.ano', 'mes.qtd_nao', 'mes.bloq',
                'tarefa.nome',
                'tarefa_mes.data_cadastro'
            ])
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('mes.mes', mes)
            .andWhere('mes.ano', ano)
            .orderBy('mes.mes');

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
                .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
                .count()
                .where('tarefa_mes.id_usuario', id_usuario)
                .andWhere('mes.mes', mes)
                .andWhere('mes.ano', ano)

            response.header('X-Total-Count', count['count(*)']);

            return response.json(tarefa_mes);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Não há dados associados à data informada'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaMesBloqByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
            .select([
                'mes.bloq',
            ])
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('mes.mes', mes)
            .andWhere('mes.ano', ano);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
                .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
                .count()
                .where('tarefa_mes.id_usuario', id_usuario)
                .andWhere('mes.mes', mes)
                .andWhere('mes.ano', ano);

            response.header('X-Total-Count', count['count(*)']);

            return response.json(tarefa_mes);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaMesById(request, response) {
        const { id } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
            .select([
                'tarefa_mes.id', 'tarefa_mes.id_tarefa', 'tarefa_mes.id_mes',
                'mes.mes', 'mes.ano', 'mes.qtd_nao', 'mes.bloq',
                'tarefa.nome',
                'tarefa_mes.data_cadastro'
            ])
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.id', id);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
                .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
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

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaMesBloqById(request, response) {
        const { id } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_mes = await connection('tarefa_mes')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
            .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
            .select([
                'mes.bloq',
            ])
            .where('tarefa_mes.id_usuario', id_usuario)
            .andWhere('tarefa_mes.id', id);

        if (tarefa_mes.length > 0) {
            const [count] = await connection('tarefa_mes')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
                .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
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