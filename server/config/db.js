const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MYSQL_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
};

const useSqliteFallback = true;

async function createMysqlPool() {
  try {
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
    // test connection
    await pool.execute('SELECT 1');
    console.log('Using MySQL as database');
    return {
      type: 'mysql',
      execute: (...args) => pool.execute(...args),
    };
  } catch (err) {
    console.warn('MySQL unavailable, falling back to SQLite:', err && err.code ? err.code : err.message || err);
    if (!useSqliteFallback) throw err;
    return null;
  }
}

async function createSqliteDb() {
  const sqlite3 = require('sqlite3').verbose();
  const DATA_DIR = path.resolve(__dirname, '../data');
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const DB_FILE = path.join(DATA_DIR, 'shelterx.sqlite');

  const db = await new Promise((resolve, reject) => {
    const d = new sqlite3.Database(DB_FILE, (err) => {
      if (err) return reject(err);
      resolve(d);
    });
  });

  const runAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

  const allAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  const execAsync = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // ensure schema
  const seedSqlPath = path.resolve(__dirname, '../seeds/sqlite_seed.sql');
  if (fs.existsSync(seedSqlPath)) {
    const sql = fs.readFileSync(seedSqlPath, 'utf8');
    try {
      await execAsync(sql);
      console.log('SQLite DB initialized from seed');
    } catch (e) {
      console.warn('Failed running sqlite seed:', e.message || e);
    }
  }

  return {
    type: 'sqlite',
    execute: async (sql, params = []) => {
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT')) {
        const rows = await allAsync(sql, params);
        return [rows];
      } else {
        const res = await runAsync(sql, params);
        return [{ insertId: res.lastID, affectedRows: res.changes }];
      }
    },
    close: async () => new Promise((res) => db.close(res)),
  };
}

let client = null;

(async () => {
  client = await createMysqlPool();
  if (!client) {
    client = await createSqliteDb();
  }
})();

// export a proxy object that waits until client is ready
module.exports = new Proxy({}, {
  get(_, prop) {
    if (prop === 'execute') {
      return async (...args) => {
        // wait until client initialized
        let attempts = 0;
        while (!client && attempts < 50) {
          // small delay
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
