const mysql = require('mysql2/promise');
(async () => {
  try {
    console.log('DB_HOST', process.env.DB_HOST);
    console.log('DB_USER', process.env.DB_USER);
    console.log('DB_NAME', process.env.DB_NAME);
    console.log('DB_PASSWORD', process.env.DB_PASSWORD ? '***' : '(unset)');
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      process.exit(0);
    }
    const db = await mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });
    const [rows] = await db.query('SELECT id, nome FROM categorias LIMIT 10');
    console.log('categorias sample:', rows);
    const [rows2] = await db.query('SHOW COLUMNS FROM solicitacoes_patrimonio');
    console.log('solicitacoes_patrimonio columns:', rows2.map(r => r.Field));
    await db.end();
  } catch (err) {
    console.error('DB error', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
