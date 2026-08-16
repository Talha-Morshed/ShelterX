const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  const sqlFile = path.resolve(__dirname, '../seeds/seed.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log('Seed SQL executed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to run seed:', err.message || err);
    process.exit(1);
  } finally {
    try { await connection.end(); } catch(e){}
  }
}

run();
