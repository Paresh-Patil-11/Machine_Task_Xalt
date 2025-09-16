
const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'login_db',
  password: 'postgresql@123',
  port: 5432,
})

module.export = pool;