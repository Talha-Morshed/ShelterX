const path = require('path');
const { AsyncLocalStorage } = require('async_hooks');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MYSQL_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
};

const transactionContext = new AsyncLocalStorage();

let client = null;

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
    getConnection: () => pool.getConnection(),
    close: async () => pool.end(),
  };
}

(async () => {
  try {
    client = await createMysqlPool();
  } catch (err) {
    console.error('MySQL connection failed:', err.message || err);
    process.exit(1);
  }
})();

const waitForClient = async () => {
  let attempts = 0;
  while (!client && attempts < 50) {
    await new Promise((r) => setTimeout(r, 100));
    attempts += 1;
  }
  if (!client) throw new Error('No DB client available');
  return client;
};

const createExecutor = (connection) => ({
  execute: (...args) => connection.execute(...args),
  query: (...args) => connection.query(...args),
  connection,
});

const rollbackQuietly = async (connection) => {
  try {
    await connection.rollback();
  } catch (err) {
    console.error('Transaction rollback failed:', err.message || err);
  }
};

const runWithSavepoint = async (context, work) => {
  const savepoint = `sp_${context.depth + 1}`;
  context.depth += 1;
  await context.connection.query(`SAVEPOINT ${savepoint}`);

  try {
    const result = await work(createExecutor(context.connection));
    await context.connection.query(`RELEASE SAVEPOINT ${savepoint}`);
    return result;
  } catch (error) {
    try {
      await context.connection.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
    } catch (err) {
      console.error('Savepoint rollback failed:', err.message || err);
    }
    throw error;
  } finally {
    context.depth -= 1;
  }
};

const withTransaction = async (work) => {
  if (typeof work !== 'function') {
    throw new TypeError('withTransaction requires a function');
  }

  const active = transactionContext.getStore();
  if (active) {
    return runWithSavepoint(active, work);
  }

  const ready = await waitForClient();
  const connection = await ready.getConnection();
  const context = { connection, depth: 0 };

  try {
    await connection.beginTransaction();
    const result = await transactionContext.run(context, () => work(createExecutor(connection)));
    await connection.commit();
    return result;
  } catch (error) {
    await rollbackQuietly(connection);
    throw error;
  } finally {
    connection.release();
  }
};

const getConnection = async () => {
  const active = transactionContext.getStore();
  if (active) return active.connection;
  const ready = await waitForClient();
  return ready.getConnection();
};

const isInTransaction = () => transactionContext.getStore() !== undefined;

module.exports = new Proxy({}, {
  get(_, prop) {
    if (prop === 'execute') {
      return async (...args) => {
        const active = transactionContext.getStore();
        if (active) return active.connection.execute(...args);
        const ready = await waitForClient();
        return ready.execute(...args);
      };
    }
    if (prop === 'withTransaction') {
      return withTransaction;
    }
    if (prop === 'getConnection') {
      return getConnection;
    }
    if (prop === 'isInTransaction') {
      return isInTransaction;
    }
    if (prop === 'close') {
      return async () => client && client.close && client.close();
    }
    return undefined;
  },
});
