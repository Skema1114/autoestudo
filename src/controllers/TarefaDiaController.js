const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
    // ATUALIZADO PARA ULTIMA VERSÃO
    async get(request, response) {
        const id_usuario = request.headers.authorization;

        const tarefa_dias = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .select([
                'tarefa_dia.id', 'tarefa_dia.id_tarefa', 'tarefa_dia.id_dia', 'tarefa_dia.id_usuario', 'tarefa_dia.status',
                'dia.dia', 'dia.mes', 'dia.ano', 'dia.bloq',
                'tarefa.nome',
                'tarefa_dia.data_cadastro'
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .orderBy('tarefa_dia.id');

        if (tarefa_dias.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(tarefa_dias);
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async post(request, response) {
        const { tarefas, dias, mes, ano } = request.body;
        const id_usuario = request.headers.authorization;
        const data_cadastro = moment().utcOffset('-03:00').format("DD/MM/YYYY HH:mm:ss");
        const bloq = 'nao';
        const status = 'nao';
        const trx = await connection.transaction();

        try {
            dias.map(async (dia) => {
                const diaData = {
                    dia,
                    mes,
                    ano,
                    data_cadastro,
                    bloq
                }

                var insertedIds = await trx("dia").insert(diaData);

                const dia_id = insertedIds[0];

                const tarefaDiaData = tarefas.map((tarefa_id) => {
                    return {
                        id_tarefa: tarefa_id,
                        id_usuario,
                        id_dia: dia_id,
                        status,
                        data_cadastro
                    }
                })

                await trx("tarefa_dia").insert(tarefaDiaData);
                await trx.commit()
            })

            return response.sendStatus(204);
        } catch (err) {
            return response.status(412).json({ msg: error.message });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async patch(request, response) {
        const { id } = request.params;
        const id_usuario = request.headers.authorization;
        const { status, bloq } = request.body;

        const tarefaDiaTeste = await connection('tarefa_dia')
            .where('tarefa_dia.id', id)
            .select('id_usuario')
            .first()

        if (tarefaDiaTeste.id_usuario !== id_usuario) {
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }

        const tarefaDia = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .where('tarefa_dia.id', id)
            .andWhere('tarefa_dia.id_usuario', id_usuario)
            .update({
                'tarefa_dia.status': status,
                'dia.bloq': bloq
            })
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({ msg: error.message })
            })
    },

    async patchFinalizaDiaManual(request, response) {
        const id_usuario = request.headers.authorization;
        const { tarefas, status, bloq } = request.body;

        try {
            for (let i = 0; i < tarefas.length; i++) {
                try {
                    if (bloq[i] === 'nao') {
                        const tarefaDiaTeste = await connection('tarefa_dia')
                            .where('tarefa_dia.id', tarefas[i])
                            .select('id_usuario')
                            .first()

                        if (tarefaDiaTeste.id_usuario !== id_usuario) {
                            return response.status(401).json({
                                error: 'Sem permissões'
                            });
                        }

                        const tarefaDia = await connection('tarefa_dia')
                            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                            .where('tarefa_dia.id', tarefas[i])
                            .andWhere('tarefa_dia.id_usuario', id_usuario)
                            .update({
                                'tarefa_dia.status': status[i],
                                'dia.bloq': 'sim'
                            })
                    }
                } catch (err) {
                    console.log("ERRO DENTRO DO FOR " + err)
                }
            }
            return response.sendStatus(204)
        } catch (err) {
            return response.status(412).json({ msg: error.message })
        }
    },

    async delete(request, response) {
        const { id } = request.params;
        const id_usuario = request.headers.authorization;

        const tarefa_dias = await connection('tarefa_dia')
            .where('id', id)
            .select('id_usuario')
            .first()

        if ((tarefa_dias.id_usuario !== id_usuario) && (tarefa_dias.id_tarefa !== id)) {
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
        await connection('tarefa_dia').where('id', id).delete();

        return response.status(204).send();
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaByDiaMesAno(request, response) {
        const { dia, mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_dia = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .select([
                'tarefa_dia.id', 'tarefa_dia.id_tarefa', 'tarefa_dia.id_dia', 'tarefa_dia.status',
                'dia.dia', 'dia.mes', 'dia.ano', 'dia.bloq',
                'tarefa.nome',
                'tarefa_dia.data_cadastro'
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('dia.dia', dia)
            .andWhere('dia.mes', mes)
            .andWhere('dia.ano', ano);

        if (tarefa_dia.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('dia.dia', dia)
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);


            response.header('X-Total-Count', count['count(*)']);

            return response.json(tarefa_dia);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Não dados associados à esta data'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaBloqByDiaMesAno(request, response) {
        const { dia, mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const bloq = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .select([
                'dia.bloq',
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('dia.dia', dia)
            .andWhere('dia.mes', mes)
            .andWhere('dia.ano', ano);

        if (bloq.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('dia.dia', dia)
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);

            response.header('X-Total-Count', count['count(*)']);

            return response.json(bloq);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaById(request, response) {
        const { id } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_dia = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .select([
                'tarefa_dia.id', 'tarefa_dia.id_tarefa', 'tarefa_dia.id_dia', 'tarefa_dia.id_usuario', 'tarefa_dia.status',
                'dia.dia', 'dia.mes', 'dia.ano', 'dia.bloq',
                'tarefa.nome',
                'tarefa_dia.data_cadastro'
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.id', id);

        if (tarefa_dia.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.id', id);

            response.header('X-Total-Count', count['count(*)']);

            return response.json(tarefa_dia);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaBloqById(request, response) {
        const { id } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const bloq = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .select([
                'tarefa_dia.id', 'tarefa_dia.id_tarefa', 'tarefa_dia.id_dia', 'tarefa_dia.id_usuario', 'tarefa_dia.status',
                'dia.dia', 'dia.mes', 'dia.ano', 'dia.bloq',
                'tarefa.nome',
                'tarefa_dia.data_cadastro'
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.id', id);

        if (bloq.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.id', id);

            response.header('X-Total-Count', count['count(*)']);

            return response.json(bloq);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissões'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaConcluidoByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [concluido] = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .count()
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.status', 'sim')
            .andWhere('dia.mes', mes)
            .andWhere('dia.ano', ano);

        if ([concluido].length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.status', 'sim')
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);

            response.header('X-Total-Count', count['count(*)']);

            const concluidoFinal = concluido['count(*)'];

            return response.json({
                concluido: concluidoFinal
            });
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissão'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaNaoConcluidoByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [naoConcluido] = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .count()
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.status', 'nao')
            .andWhere('dia.mes', mes)
            .andWhere('dia.ano', ano);

        if ([naoConcluido].length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.status', 'nao')
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);

            response.header('X-Total-Count', count['count(*)']);

            const naoConcluidoFinal = naoConcluido['count(*)'];

            return response.json({
                naoConcluido: naoConcluidoFinal
            });
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissão'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaTotalByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [total] = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .count()
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('dia.mes', mes)
            .andWhere('dia.ano', ano);

        if ([total].length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);

            response.header('X-Total-Count', count['count(*)']);

            const totalFinal = total['count(*)'];

            return response.json({
                total: totalFinal
            });
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissão'
            });
        }
    },

    // ATUALIZADO PARA ULTIMA VERSÃO
    async getTarefaDiaSucessoByMesAno(request, response) {
        const { dia, mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);
        var qtdTarefasNoDia = 0;
        var qtdSimTarefasNoDia = 0;
        var qtdNaoTarefasNoDia = 0;
        var qtdNaoInformada = 0;

        const bloq = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
            .select([
                'dia.bloq',
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('dia.dia', dia)
            .andWhere('dia.mes', mes)
            .andWhere('dia.ano', ano)
            .orderBy('tarefa_dia.id');

        if (bloq[0].bloq === 'sim') {
            const tarefasNoDia = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('dia.dia', dia)
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);

            const simTarefasNoDia = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .join('dia', 'dia.id', '=', 'tarefa_dia.id_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.status', 'sim')
                .andWhere('dia.dia', dia)
                .andWhere('dia.mes', mes)
                .andWhere('dia.ano', ano);

            const qtd_nao = await connection('tarefa_mes')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_mes.id_tarefa')
                .join('mes', 'mes.id', '=', 'tarefa_mes.id_mes')
                .select([
                    'mes.qtd_nao',
                ])
                .where('tarefa_mes.id_usuario', id_usuario)
                .andWhere('mes.mes', mes)
                .andWhere('mes.ano', ano);

            qtdTarefasNoDia = tarefasNoDia[0]['count(*)'];
            qtdSimTarefasNoDia = simTarefasNoDia[0]['count(*)'];
            qtdNaoTarefasNoDia = qtdTarefasNoDia - qtdSimTarefasNoDia;
            qtdNaoInformada = qtd_nao[0].qtd_nao;

            if (qtdNaoTarefasNoDia > qtdNaoInformada) {
                return response.json({ message: 'fracasso' });
            } else if (qtdNaoTarefasNoDia <= qtdNaoInformada) {
                return response.json({ message: 'sucesso' });
            }
        } else {
            return response.json({ message: 'aguardando' });
        }
    },
};