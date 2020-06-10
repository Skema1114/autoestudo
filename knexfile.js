// Update with your config settings.
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
    timestamps: true,
    underscored: true
  },

  /*
    development: {
      client: 'mysql',
      connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '123456',
        database : 'autoestudo_teste',
      },
      migrations: {
        directory: './src/database/migrations'
      },
      useNullAsDefault: true,
      timestamps : true,
      underscored : true
    },
  */
  /*
    development: {
      client: 'sqlite3',
      connection: {
        filename: './src/database/autoEstudoDb.sqlite'
      },
      migrations: {
        directory: './src/database/migrations'
      },
      useNullAsDefault: true,
    },
  */

  test: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/TesteAutoEstudoDb.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
