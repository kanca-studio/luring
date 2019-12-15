import pg from 'pg';

const db = new pg.Pool({
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export default db;
