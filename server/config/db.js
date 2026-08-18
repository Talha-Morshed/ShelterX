const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MYSQL_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
};

async function createMysqlPool() {
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: MYSQL_CONFIG.host,
    user: MYSQL_CONFIG.user,
    password: MYSQL_CONFIG.password,
    database: MYSQL_CONFIG.database,
    port: MYSQL_CONFIG.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  await pool.execute('SELECT 1');
  console.log('Using MySQL as database');
  return {
    type: 'mysql',
    execute: (...args) => pool.execute(...args),
    close: async () => pool.end(),
  };
}

let client = null;

(async () => {
  try {
    client = await createMysqlPool();
  } catch (err) {
    console.error('MySQL connection failed:', err.message || err);
    process.exit(1);
  }
})();

module.exports = new Proxy({}, {
  get(_, prop) {
    if (prop === 'execute') {
      return async (...args) => {
        let attempts = 0;
        while (!client && attempts < 50) {
          await new Promise((r) => setTimeout(r, 100));
          attempts += 1;
        }
        if (!client) throw new Error('No DB client available');
        return client.execute(...args);
      };
    }
    if (prop === 'close') {
      return async () => client && client.close && client.close();
    }
    return undefined;
  }
});
