const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const UsuarioController = require('./controllers/UsuarioController');
const MesController = require('./controllers/MesController');
const DiaController = require('./controllers/DiaController');
const TarefaController = require('./controllers/TarefaController');
const TarefaDiaController = require('./controllers/TarefaDiaController');
const ResultadoDiaController = require('./controllers/ResultadoDiaController');
const ResultadoMesController = require('./controllers/ResultadoMesController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();


/**
 * ####################  /USUARIO
 */

routes.get('/usuarios', celebrate({
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })  
}), UsuarioController.index);
routes.post('/usuario', celebrate({
          [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required(),
            email: Joi.string().required(),
            senha: Joi.string().required(),
          })
}), UsuarioController.create);
routes.delete('/usuario/:id',celebrate({
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.string().required()
          })
}), UsuarioController.delete);


/**
 * #################### /MES
 */

routes.get('/meses',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })  
}), MesController.index);
routes.post('/mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            mes: Joi.string().required(),
            ano: Joi.string().required(),
            qtd_nao: Joi.string().required()
          })
}), MesController.create);
routes.delete('/mes/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), MesController.delete);



/**
 * #################### /DIA
 */

routes.get('/dias',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })  
}), DiaController.index);
routes.post('/dia/:id_mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            data: Joi.string().required(),
          }),
          [Segments.PARAMS]: Joi.object().keys({
            id_mes: Joi.number().required()
          })
}), DiaController.create);
routes.delete('/dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), DiaController.delete);



/**
 * #################### /TAREFA
 */

routes.get('/tarefas',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })     
}), TarefaController.index);
routes.post('/tarefa',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required(),
            data_criacao: Joi.string().required()
          })
}), TarefaController.create);
routes.delete('/tarefa/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaController.delete);





/**
 * #################### /TAREFA DIA
 */

routes.get('/tarefa_dias',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })  
}), TarefaDiaController.index);
routes.post('/tarefa_dia/:id_tarefa',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            status: Joi.string().required(),
          }),
          [Segments.PARAMS]: Joi.object().keys({
            id_tarefa: Joi.number().required()
          })
}), TarefaDiaController.create);
routes.delete('/tarefa_dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaDiaController.delete);



/**
 * #################### /RESULTADO DIA
 */

routes.get('/resultado_dias',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })  
}), ResultadoDiaController.index);
routes.post('/resultado_dia/:id_dia',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            resultado: Joi.string().required(),
            qtd_nao: Joi.string().required(),
          }),
          [Segments.PARAMS]: Joi.object().keys({
            id_dia: Joi.number().required()
          })
}), ResultadoDiaController.create);
routes.delete('/resultado_dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), ResultadoDiaController.delete);



/**
 * #################### /RESULTADO MES
 */

routes.get('/resultado_meses',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
          })  
}), ResultadoMesController.index);
routes.post('/resultado_mes/:id_mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            resultado: Joi.string().required(),
          }),
          [Segments.PARAMS]: Joi.object().keys({
            id_mes: Joi.number().required()
          })
}), ResultadoMesController.create);
routes.delete('/resultado_mes/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), ResultadoMesController.delete);



/**
 * #################### /SESSIONS
 */
routes.post('/sessions',celebrate({
          [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required(),
            senha: Joi.string().required()
          })
}), SessionController.create);

module.exports = routes;