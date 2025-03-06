const { Pool } = require('pg');

const pool = new Pool({
  host: "postgres.railway.internal",
  user: "postgres",
  password: "XgNnSalyHqficffhEHyGWxfJdmyQnabW",
  database: "railway",
  // host: "localhost",
  // user: "postgres",
  // password: "9917",
  // database: "gamers-storeback",
  port: 5432,
  allowExitOnIdle: true,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};