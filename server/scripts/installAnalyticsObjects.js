const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Adnan - Execute the raw view and procedure SQL in separate MySQL statements.
const getSqlStatements = () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '../queries/view_procedure.sql'), 'utf8');
  const procedureStatements = [...sql.matchAll(/CREATE PROCEDURE[\s\S]*?END\$\$/gi)]
    .map((match) => match[0].replace(/\$\$$/, '').trim());
  const setupStatements = sql
    .replace(/CREATE PROCEDURE[\s\S]*?END\$\$/gi, '')
    .replace(/DELIMITER\s+\$\$|DELIMITER\s+;/gi, '')
    .trim();
  return [setupStatements, ...procedureStatements].filter(Boolean);
};

// Adnan - Install all dashboard SQL objects using the configured ShelterX database connection.
const run = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shelterx',
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  });

  try {
    await connection.query('DROP PROCEDURE IF EXISTS sp_facilities_by_min_capacity');
    await connection.query('DROP PROCEDURE IF EXISTS sp_facility_activity_report');
    await connection.query('DROP PROCEDURE IF EXISTS sp_facility_capacity_status');
    await connection.query('DROP PROCEDURE IF EXISTS sp_facility_capacity_bands');
    for (const statement of getSqlStatements()) {
      await connection.query(statement);
    }
    console.log('Analytics views and procedures installed successfully');
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error('Failed to install analytics objects:', error.message || error);
  process.exitCode = 1;
});