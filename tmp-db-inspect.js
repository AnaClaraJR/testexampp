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
    for (const table of ['pontos_turisticos', 'solicitacoes_patrimonio']) {
      const [rows] = await conn.execute(
        'SELECT column_name, column_type, is_nullable, column_key FROM information_schema.columns WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position',
        ['acervo_rondoniense', table]
      );
      console.log('TABLE', table);
      console.table(rows);
    }
    await conn.end();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
