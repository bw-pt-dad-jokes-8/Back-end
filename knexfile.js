const dbConnection = process.env.DATABASE_URL;
require('dotenv').config();

module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: { filename: './database/database.db3'},
    migrations: {
      directory: './database/migrations/'
    },
    seeds: {
      directory: './database/seeds/'
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys=ON', done);
      }
    }
  },
  production: {
    client: 'pg',
    connection: dbConnection,
    useNullAsDefault: true,
    migrations: {
      directory: '/database/migrations'
    },
    seeds: {
      directory: '/database/seeds'
    }
  }
};
