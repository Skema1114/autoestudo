const connection = require('../database/connection');
const generateUniqueToken = require('../util/generateUniqueId');
const moment = require('moment');

module.exports = {
    async get(request, response) {

        const usuarios = await connection('usuario')
            .select('*');

        if (usuarios.length > 0) {
            const [count] = await connection('usuario')
                .count()

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(usuarios);
    },

    async post(request, response) {
        const { nome, email, senha } = request.body;
        const token = generateUniqueToken();
        const data_cadastro = moment().utcOffset('-03:00').format("DD/MM/YYYY HH:mm:ss");
        const bloq = 'nao';

        const usuario = await connection('usuario').insert({
            token,
            nome,
            email,
            senha,
            data_cadastro,
            bloq
        });

        return response.sendStatus(200);
    },

    async patch(request, response) {
        const { id } = request.params;
        const id_usuario = request.headers.authorization;
        const usuarioBody = request.body;

        const usuarioTeste = await connection('usuario')
            .where('id', id)
            .select('id')
            .first()

        if (usuarioTeste.id !== id_usuario) {
            return response.status(401).json({
                error: 'Sem permissões'
            });
        }

        const usuario = await connection('usuario')
            .where('id', id)
            .update(usuarioBody)
            .then(result => response.sendStatus(204))
            .catch(error => {
                response.status(412).json({ msg: error.message })
            })
    },
}