const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const out = (m) => process.stdout.write(`${m}\n`);

const run = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
  });

  const hasColumn = async (table, column) => {
    const [rows] = await connection.query(
      `SELECT COUNT(*) n FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [process.env.DB_NAME, table, column]
    );
    return rows[0].n > 0;
  };

  const hasConstraint = async (name) => {
    const [rows] = await connection.query(
      `SELECT COUNT(*) n FROM information_schema.TABLE_CONSTRAINTS
       WHERE CONSTRAINT_SCHEMA = ? AND CONSTRAINT_NAME = ?`,
      [process.env.DB_NAME, name]
    );
    return rows[0].n > 0;
  };

  const hasIndex = async (table, index) => {
    const [rows] = await connection.query(
      `SELECT COUNT(*) n FROM information_schema.STATISTICS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
      [process.env.DB_NAME, table, index]
    );
    return rows[0].n > 0;
  };

  const hasObject = async (type, name) => {
    const [rows] = await connection.query(
      `SELECT COUNT(*) n FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND TABLE_TYPE = ?`,
      [process.env.DB_NAME, name, type]
    );
    return rows[0].n > 0;
  };

  try {
    const columns = [
      ['facilities', 'state', 'VARCHAR(50) NULL'],
      ['facilities', 'zip_code', 'VARCHAR(20) NULL'],
      ['facilities', 'email', 'VARCHAR(255) NULL'],
      ['facilities', 'is_active', 'BOOLEAN NOT NULL DEFAULT TRUE'],
      ['users', 'is_active', 'BOOLEAN NOT NULL DEFAULT TRUE'],
    ];

    for (const [table, column, definition] of columns) {
      if (await hasColumn(table, column)) {
        out(`skip    ${table}.${column} already exists`);
        continue;
      }
      await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      out(`add     ${table}.${column} ${definition}`);
    }

    const constraints = [
      ['chk_capacity', 'ALTER TABLE facilities ADD CONSTRAINT chk_capacity CHECK (capacity >= 0)'],
      ['chk_available_spaces', 'ALTER TABLE facilities ADD CONSTRAINT chk_available_spaces CHECK (available_spaces >= 0)'],
      ['chk_spaces_lte_cap', 'ALTER TABLE facilities ADD CONSTRAINT chk_spaces_lte_cap CHECK (available_spaces <= capacity)'],
    ];

    for (const [name, sql] of constraints) {
      if (await hasConstraint(name)) {
        out(`skip    constraint ${name} already exists`);
        continue;
      }
      await connection.query(sql);
      out(`add     constraint ${name}`);
    }

    const indexes = [
      ['facilities', 'idx_facilities_state', 'CREATE INDEX idx_facilities_state ON facilities (state)'],
    ];

    for (const [table, name, sql] of indexes) {
      if (await hasIndex(table, name)) {
        out(`skip    index ${name} already exists`);
        continue;
      }
      await connection.query(sql);
      out(`add     index ${name}`);
    }

    if (!(await hasObject('BASE TABLE', 'facility_capacity_history'))) {
      await connection.query(`
        CREATE TABLE facility_capacity_history (
          history_id INT AUTO_INCREMENT PRIMARY KEY,
          facility_id INT NOT NULL,
          facility_name VARCHAR(255) NOT NULL,
          old_capacity INT NOT NULL,
          new_capacity INT NOT NULL,
          old_available_spaces INT NOT NULL,
          new_available_spaces INT NOT NULL,
          changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_capacity_history_facility (facility_id, changed_at)
        )
      `);
      out('create  table facility_capacity_history');
    } else {
      out('skip    table facility_capacity_history already exists');
    }

    if (!(await hasObject('BASE TABLE', 'donation_deletion_history'))) {
      await connection.query(`
        CREATE TABLE donation_deletion_history (
          history_id INT AUTO_INCREMENT PRIMARY KEY,
          donation_id INT NOT NULL,
          facility_id INT NOT NULL,
          user_id INT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          donation_type VARCHAR(20) NOT NULL,
          donation_created_at DATETIME NOT NULL,
          deleted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_donation_deletion_history_donation_id (donation_id),
          INDEX idx_donation_deletion_history_deleted_at (deleted_at)
        )
      `);
      out('create  table donation_deletion_history');
    } else {
      out('skip    table donation_deletion_history already exists');
    }

    const [donationDeleteTriggers] = await connection.query(
      `SELECT COUNT(*) n FROM information_schema.TRIGGERS
       WHERE TRIGGER_SCHEMA = ? AND TRIGGER_NAME = 'trg_donations_delete_audit_ad'`,
      [process.env.DB_NAME]
    );

    if (donationDeleteTriggers[0].n > 0) {
      out('skip    trigger trg_donations_delete_audit_ad already exists');
    } else {
      await connection.query(`
        CREATE TRIGGER trg_donations_delete_audit_ad
        AFTER DELETE ON donations
        FOR EACH ROW
        BEGIN
          INSERT INTO donation_deletion_history (
            donation_id, facility_id, user_id, amount,
            donation_type, donation_created_at
          ) VALUES (
            OLD.donation_id, OLD.facility_id, OLD.user_id, OLD.amount,
            OLD.donation_type, OLD.created_at
          );
        END
      `);
      out('create  trigger trg_donations_delete_audit_ad');
    }

    const [triggers] = await connection.query(
      `SELECT COUNT(*) n FROM information_schema.TRIGGERS
       WHERE TRIGGER_SCHEMA = ? AND TRIGGER_NAME = 'trg_facilities_capacity_audit_au'`,
      [process.env.DB_NAME]
    );

    if (triggers[0].n > 0) {
      out('skip    trigger trg_facilities_capacity_audit_au already exists');
    } else {
      await connection.query(`
        CREATE TRIGGER trg_facilities_capacity_audit_au
        AFTER UPDATE ON facilities
        FOR EACH ROW
        BEGIN
          IF OLD.capacity <> NEW.capacity
              OR OLD.available_spaces <> NEW.available_spaces THEN
            INSERT INTO facility_capacity_history (
              facility_id, facility_name,
              old_capacity, new_capacity,
              old_available_spaces, new_available_spaces,
              changed_at
            ) VALUES (
              NEW.facility_id, NEW.facility_name,
              OLD.capacity, NEW.capacity,
              OLD.available_spaces, NEW.available_spaces,
              CURRENT_TIMESTAMP
            );
          END IF;
        END
      `);
      out('create  trigger trg_facilities_capacity_audit_au');
    }

    out('\nSchema is in line with schema.sql and queries/facility_capacity_audit.sql');
  } finally {
    await connection.end();
  }
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    out(`ERROR ${error && (error.stack || error.message)}`);
    process.exit(1);
  });
