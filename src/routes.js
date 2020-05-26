const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const ResultadoDiaController = require('./controllers/ResultadoDiaController');
const ResultadoMesController = require('./controllers/ResultadoMesController');
const TarefaDiaController = require('./controllers/TarefaDiaController');
const TarefaMesController = require('./controllers/TarefaMesController');
const UsuarioController = require('./controllers/UsuarioController');
const SessionController = require('./controllers/SessionController');
const TarefaController = require('./controllers/TarefaController');

const routes = express.Router();


/**
 * ####################  /USUARIO
 */

routes.get('/usuarios', celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
}), UsuarioController.get);

routes.post('/usuario', celebrate({
          [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required(),
            email: Joi.string().required(),
            senha: Joi.string().required(),
            data_cadastro: Joi.string().required(),
          })
}), UsuarioController.post);

routes.patch('/usuario/:id', celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.string().required()
          })
}), UsuarioController.patch);



/**
 * #################### /TAREFA
 */

routes.get('/tarefas',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),   
}), TarefaController.get);

routes.post('/tarefa',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required(),
            data_cadastro: Joi.string().required()
          })
}), TarefaController.post);

routes.patch('/tarefa/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaController.patch);

routes.delete('/tarefa/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
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
            authorization: Joi.number().required()
          }).unknown(),
}), TarefaDiaController.get);

routes.get('/tarefa_dias/pesquisar/:dia/:mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            dia: Joi.number().required(),
            mes: Joi.number().required(),
          })
}), TarefaDiaController.getTarefaDiaByDiaMes);

routes.get('/tarefa_dias/checar/:dia/:mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            dia: Joi.number().required(),
            mes: Joi.number().required(),
          })
}), TarefaDiaController.getTarefaDiaBloqByDiaMes);

routes.get('/tarefa_dia/pesquisar/:id',celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.number().required()
  }).unknown(),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  })
}), TarefaDiaController.getTarefaDiaById);

routes.get('/tarefa_dia/checar/:id',celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.number().required()
  }).unknown(),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  })
}), TarefaDiaController.getTarefaDiaBloqById);

routes.post('/tarefa_dia',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            id_tarefa: Joi.number().required(),
            dia: Joi.number().required(),
            mes: Joi.number().required(),
            status: Joi.string().required(),
            data_cadastro: Joi.string().required(),
            bloq: Joi.string(),
          }),
}), TarefaDiaController.post);

routes.patch('/tarefa_dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaDiaController.patch);

routes.delete('/tarefa_dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaDiaController.delete);



/**
 * #################### /TAREFA MES
 */
routes.get('/tarefa_meses',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
}), TarefaMesController.get);

routes.get('/tarefa_meses/pesquisar/:mes/:ano',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            mes: Joi.number().required(),
            ano: Joi.number().required(),
          })
}), TarefaMesController.getTarefaMesByMesAno);

routes.get('/tarefa_meses/checar/:mes/:ano',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            mes: Joi.number().required(),
            ano: Joi.number().required(),
          })
}), TarefaMesController.getTarefaMesBloqByMesAno);

routes.get('/tarefa_mes/pesquisar/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required(),
          })
}), TarefaMesController.getTarefaMesById);

routes.get('/tarefa_mes/checar/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required(),
          })
}), TarefaMesController.getTarefaMesBloqById);

routes.post('/tarefa_mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            id_tarefa: Joi.number().required(),
            mes: Joi.number().required(),
            ano: Joi.number().required(),
            qtd_nao: Joi.number().required(),
            data_cadastro: Joi.string().required(),
            bloq: Joi.string(),
          })
}), TarefaMesController.post);

routes.patch('/tarefa_mes/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaMesController.patch);

routes.delete('/tarefa_mes/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), TarefaMesController.delete);



/**
 * #################### /RESULTADO DIA
 */

routes.get('/resultado_dias',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
}), ResultadoDiaController.get);

routes.post('/resultado_dia',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            dia: Joi.number().required(),
            resultado: Joi.string().required(),
            qtd_nao: Joi.number().required(),
            data_cadastro: Joi.string().required(),
          }),
}), ResultadoDiaController.post);

routes.patch('/resultado_dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), ResultadoDiaController.patch);

routes.delete('/resultado_dia/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
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
            authorization: Joi.number().required()
          }).unknown(),
}), ResultadoMesController.get);

routes.post('/resultado_mes',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.BODY]: Joi.object().keys({
            mes: Joi.number().required(),
            resultado: Joi.string().required(),
            data_cadastro: Joi.string().required(),
          }),
}), ResultadoMesController.post);

routes.patch('/resultado_mes/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
          }).unknown(),
          [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
          })
}), ResultadoMesController.patch);

routes.delete('/resultado_mes/:id',celebrate({
          [Segments.HEADERS]: Joi.object({
            authorization: Joi.number().required()
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