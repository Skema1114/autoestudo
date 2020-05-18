const connection = require('../database/connection');
const generateUniqueId = require('../util/generateUniqueId');

module.exports = {
    async index(request, response){

        const usuarios = await connection('usuario')
        .select('*');
        
        if (usuarios.length > 0) {
            const [count] = await connection('usuario')
            .count();

            response.header('X-Total-Count', count['count(*)']);
        } else {
            response.header('X-Total-Count', 0);
        }

        return response.json(usuarios);
    },

    async create(request, response){
        const {nome, email, senha} = request.body;

        const id = generateUniqueId();
     
        await connection('usuario').insert({
            id,
            nome,
            email,
            senha,
        });
        
        return response.json({id});
    },

    async delete(request, response){
        const {id} = request.params;

        const usuarios = await connection('usuario')
            .where('id', id)
            .select('id ')
            .first()

    if(usuarios.id !== id){
            return response.status(401).json({
                error: 'Operation not permitted.'
            });
        }  
        await connection('usuario').where('id', id).delete();

        return response.status(204).send();
    }
}