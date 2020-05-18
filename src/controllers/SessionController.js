const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {email} = request.body;
        const {senha} = request.body;

        const usuarios = await connection('usuario')
            .select('id')
            .first()
            .where('email', email) 
           
        if(!usuarios){
            return response.status(400).json({
                error: 'No ONG found with this ID'
            });
        }

        return response.json(usuarios);
    }
}
