// server/pool.js
const pg = require('pg');

const config = {
    database: 'basic-todo', // The name of your database
    host: 'localhost',
    port: 5432, // Default port for PostgreSQL
    user: 'postgres', // Your PostgreSQL username
    password: '123456', // Your PostgreSQL password
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;