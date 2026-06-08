const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'acervo_rondoniense'
    });
    const queries = [
      "ALTER TABLE solicitacoes_patrimonio ADD COLUMN IF NOT EXISTS referencias TEXT NULL AFTER url_foto_principal",
      "ALTER TABLE solicitacoes_patrimonio ADD COLUMN IF NOT EXISTS destaque TINYINT(1) NOT NULL DEFAULT 0 AFTER status",
      "ALTER TABLE pontos_turisticos ADD COLUMN IF NOT EXISTS referencias TEXT NULL AFTER url_foto_principal",
      "ALTER TABLE pontos_turisticos ADD COLUMN IF NOT EXISTS destaque TINYINT(1) NOT NULL DEFAULT 0 AFTER referencias"
    ];
    for (const q of queries) {
      await conn.execute(q);
      console.log('Executed:', q);
    }
    await conn.end();
    console.log('Schema migration completed.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
