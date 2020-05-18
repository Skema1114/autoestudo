const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

var idOng;

function getIdOng(id){
  idOng = id;
  
  return idOng;
}

describe('INCIDENT', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    const response = await request(app)
    .post('/ongs')
    .send({
      name: "Teste",
      email: "teste@teste.com",
      whatsapp: "1234567890",
      city: "Teste",
      uf: "TT"
    });

    getIdOng(response.body);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to create a new INCIDENT', async () => {
    const response = await request(app)
    .post('/incidents')
    .set('Authorization', idOng)
    .send({
      title: "Caso poiu",
      description: "Detalhe do caso",
      value: 120
    });
  });
});