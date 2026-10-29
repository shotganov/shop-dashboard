const pgPromise = require("pg-promise");

const pgp = pgPromise();

pgp.pg.types.setTypeParser(1082, (value) => value);
pgp.pg.types.setTypeParser(1700, parseFloat);

const db = pgp({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = db;
