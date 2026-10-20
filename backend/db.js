
import pg from "pg"

const { Pool } = pg

const useSSL = process.env.DB_SSL === "true"

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: useSSL
    ? { rejectUnauthorized: true }
    : false,

  enableChannelBinding: useSSL
})

export default pool
