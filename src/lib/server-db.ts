import mysql from "mysql2/promise";

// Garante que o pool de conexões não seja recriado toda hora no Next.js em desenvolvimento
const globalForDb = globalThis as unknown as { conn: mysql.Pool | undefined };

export const db = globalForDb.conn ?? mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

if (process.env.NODE_ENV !== "production") globalForDb.conn = db;