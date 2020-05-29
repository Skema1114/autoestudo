const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { email } = request.body;
        const { senha } = request.body;

        const usuarios = await connection('usuario')
            .select('id')
            .where('email', email)
            .andWhere('senha', senha)
            .first();

        if (!usuarios) {
            return response.status(400).json({
                error: 'Usuário não encontrado'
            });
        }

        return response.json(usuarios);
    }
}
