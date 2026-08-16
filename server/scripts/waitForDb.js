const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';

const maxAttempts = Number(process.env.DB_WAIT_ATTEMPTS) || 30;
const delayMs = Number(process.env.DB_WAIT_DELAY_MS) || 2000;

async function wait() {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const conn = await mysql.createConnection({ host, port, user, password });
      await conn.end();
      console.log(`DB reachable at ${host}:${port}`);
      process.exit(0);
    } catch (err) {
      console.log(`DB not ready yet (${attempt}/${maxAttempts}): ${err.code || err.message}`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  console.error(`Timed out waiting for DB at ${host}:${port}`);
  process.exit(1);
}

wait();
