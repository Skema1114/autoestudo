const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
    async get(request, response) {
        const id_usuario = request.headers.authorization;

        const tarefa_dias = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .select([
                'tarefa_dia.*',
                'tarefa.nome',
            ])
            .where('tarefa_dia.id_usuario', id_usuario);

        if (tarefa_dias.length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('id_usuario', id_usuario);

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(tarefa_dias);
    },

    async post(request, response) {
        const { id_tarefa, dia, mes, ano, status } = request.body;
        const id_usuario = request.headers.authorization;
        const data_cadastro = moment().utcOffset('-03:00').format("DD/MM/YYYY HH:mm:ss");
        const bloq = 'nao';

        const [id] = await connection("tarefa_dia").insert({
            id_tarefa,
            id_usuario,
            dia,
            mes,
            ano,
            status,
            data_cadastro,
            bloq
        });

        return response.json({ id });
    },

    async patch(request, response) {
        const { id } = request.params;
        const id_usuario = request.headers.authorization;
        const tarefaDiaBody = request.body;

        const tarefaDiaTeste = await connection('tarefa_dia')
            .where('id', id)
            .select('id_usuario')
            .first()

        if (tarefaDiaTeste.id_usuario !== id_usuario) {
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }

        const tarefaDia = await connection('tarefa_dia')
            .where('id', id)
            .andWhere('id_usuario', id_usuario)
            .update(tarefaDiaBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({ msg: error.message })
            })
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

    async getTarefaDiaByDiaMesAno(request, response) {
        const { dia, mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_dia = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .select([
                'tarefa_dia.*',
                'tarefa.nome',
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.dia', dia)
            .andWhere('tarefa_dia.mes', mes)
            .andWhere('tarefa_dia.ano', ano);

        if (tarefa_dia.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.dia', dia)
                .andWhere('tarefa_dia.mes', mes)
                .andWhere('tarefa_dia.ano', ano);


            response.header('X-Total-Count', count['count(*)']);

            return response.json(tarefa_dia);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Não dados associados à esta data'
            });
        }
    },

    async getTarefaDiaBloqByDiaMesAno(request, response) {
        const { dia, mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const bloq = await connection('tarefa_dia')
            .select([
                'tarefa_dia.bloq',
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.dia', dia)
            .andWhere('tarefa_dia.mes', mes)
            .andWhere('tarefa_dia.ano', ano);

        if (bloq.length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.dia', dia)
                .andWhere('tarefa_dia.mes', mes)
                .andWhere('tarefa_dia.ano', ano);


            response.header('X-Total-Count', count['count(*)']);

            return response.json(bloq);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissão'
            });
        }
    },

    async getTarefaDiaById(request, response) {
        const { id } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const tarefa_dia = await connection('tarefa_dia')
            .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
            .select([
                'tarefa_dia.*',
                'tarefa.nome',
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.id', id);

        if (tarefa_dia.length > 0) {
            const [count] = await connection('tarefa_dia')
                .join('tarefa', 'tarefa.id', '=', 'tarefa_dia.id_tarefa')
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

    async getTarefaDiaBloqById(request, response) {
        const { id } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const bloq = await connection('tarefa_dia')
            .select([
                'tarefa_dia.bloq',
            ])
            .where('tarefa_dia.id_usuario', id_usuario)
            .andWhere('tarefa_dia.id', id);

        if (bloq.length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('tarefa_dia.id_usuario', id_usuario)
                .andWhere('tarefa_dia.id', id);

            response.header('X-Total-Count', count['count(*)']);

            return response.json(bloq);
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissão'
            });
        }
    },

    async getTarefaDiaConcluidoByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [concluido] = await connection('tarefa_dia')
            .count()
            .where('status', 'sim')
            .andWhere('id_usuario', id_usuario)
            .andWhere('mes', mes)
            .andWhere('ano', ano);

        if ([concluido].length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('status', 'sim')
                .andWhere('id_usuario', id_usuario)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

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

    async getTarefaDiaNaoConcluidoByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [naoConcluido] = await connection('tarefa_dia')
            .count()
            .where('status', 'nao')
            .andWhere('id_usuario', id_usuario)
            .andWhere('mes', mes)
            .andWhere('ano', ano);

        if ([naoConcluido].length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('status', 'nao')
                .andWhere('id_usuario', id_usuario)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

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

    async getTarefaDiaPendenteByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [pendente] = await connection('tarefa_dia')
            .count()
            .where('status', 'pendente')
            .andWhere('id_usuario', id_usuario)
            .andWhere('mes', mes)
            .andWhere('ano', ano);

        if ([pendente].length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('status', 'pendente')
                .andWhere('id_usuario', id_usuario)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

            response.header('X-Total-Count', count['count(*)']);

            const pendenteFinal = pendente['count(*)'];

            return response.json({
                pendente: pendenteFinal
            });
        } else {
            response.header('X-Total-Count', 0);

            return response.status(401).json({
                error: 'Sem permissão'
            });
        }
    },

    async getTarefaDiaTotalByMesAno(request, response) {
        const { mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);

        const [total] = await connection('tarefa_dia')
            .count()
            .where('id_usuario', id_usuario)
            .andWhere('mes', mes)
            .andWhere('ano', ano);

        if ([total].length > 0) {
            const [count] = await connection('tarefa_dia')
                .count()
                .where('id_usuario', id_usuario)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

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
    /*
        async getTarefaDiaParcialByMes(request, response) {
            const { mes } = request.params;
            const id_usuario = parseInt(request.headers.authorization);
            
            var agora = moment().utcOffset('-03:00');
            var finalMes = moment().utcOffset('-03:00').endOf('month').set({
                'hour': agora.get('hour'),
                'minute': agora.get('minute'),
                'second': agora.get('second'),
                'millisecond': agora.get('millisecond')
            });
            
            const ultimoDia = finalMes.format('D');
    
            const qtdTarefas = await connection('tarefa_dia')
                .select('id_tarefa')
                .where('id_usuario', id_usuario)
                .andWhere('mes', mes)
                .andWhere('dia', ultimoDia)
                .groupBy('id_tarefa')
    
            const [parcial] = await connection('tarefa_dia')
                .count()
                .where('id_usuario', id_usuario)
                .andWhere('mes', mes);
    
            if ([parcial].length > 0) {
                const [count] = await connection('tarefa_dia')
                    .count()
                    .where('id_usuario', id_usuario)
                    .andWhere('mes', mes);
    
                response.header('X-Total-Count', count['count(*)']);
    
                const qtdTarefasFinal = qtdTarefas['count(*)'];
                const parcialFinal = parcial['count(*)'];
                var resultadoParcialFinal;
                if (qtdTarefasFinal > 0){
                    resultadoParcialFinal = (parcialFinal / qtdTarefasFinal);
                }
    
                return response.json(qtdTarefas);
            } else {
                response.header('X-Total-Count', 0);
    
                return response.status(401).json({
                    error: 'Sem permissão'
                });
            }
        },*/

    async getTarefaDiaSucessoByMesAno(request, response) {
        const { dia, mes, ano } = request.params;
        const id_usuario = parseInt(request.headers.authorization);
        var qtdTarefasNoDia = 0;
        var qtdSimTarefasNoDia = 0;
        var qtdNaoTarefasNoDia = 0;
        var qtdNaoInformada = 0;

        const bloq = await connection('tarefa_dia')
            .select('*')
            .where('id_usuario', id_usuario)
            .andWhere('dia', dia)
            .andWhere('mes', mes)
            .andWhere('ano', ano);

        if (bloq[0].bloq === 'sim') {
            const tarefasNoDia = await connection('tarefa_dia')
                .count()
                .where('id_usuario', id_usuario)
                .andWhere('dia', dia)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

            const simTarefasNoDia = await connection('tarefa_dia')
                .count()
                .where('id_usuario', id_usuario)
                .andWhere('status', 'sim')
                .andWhere('dia', dia)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

            const qtd_nao = await connection('tarefa_mes')
                .select([
                    'qtd_nao',
                ])
                .where('id_usuario', id_usuario)
                .andWhere('mes', mes)
                .andWhere('ano', ano);

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