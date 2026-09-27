const db = require('../config/db');
const facilityModel = require('../models/facilityModel');
const mysql = require('mysql2/promise');

const out = (m) => process.stdout.write(`${m}\n`);
let failures = 0;
const check = (name, cond, extra) => {
  out(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond || !extra ? '' : `  -> ${extra}`}`);
  if (!cond) failures++;
};

const run = async () => {
  const observer = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
  });

  const outside = (sql, params) => observer.query(sql, params);
  const countOf = async (name) =>
    (await outside('SELECT COUNT(*) n FROM facilities WHERE facility_name = ?', [name]))[0][0].n;
  const seed = (name, capacity) => db.execute(
    `INSERT INTO facilities (facility_name, facility_type, address, city, capacity, available_spaces)
     VALUES (?, 'other', 'tx-check', 'tx-check', ?, ?)`,
    [name, capacity, capacity]
  );
  const idOf = async (name) =>
    (await outside('SELECT facility_id FROM facilities WHERE facility_name = ?', [name]))[0][0].facility_id;
  const capacityIn = async (id) => Number((await facilityModel.getFacilityById(id)).capacity);
  const capacityOut = async (id) =>
    (await outside('SELECT capacity FROM facilities WHERE facility_id = ?', [id]))[0][0].capacity;
  const setCapacity = (id, capacity) => db.execute(
    'UPDATE facilities SET capacity = ?, available_spaces = ? WHERE facility_id = ?',
    [capacity, capacity, id]
  );

  try {
    out('--- 1. commit -------------------------------------------------');
    await db.withTransaction(async () => {
      await seed('TXCHK_A', 5);
      await seed('TXCHK_B', 5);
      check('uncommitted rows invisible to another connection', (await countOf('TXCHK_A')) === 0);
    });
    check('both rows committed', (await countOf('TXCHK_A')) === 1 && (await countOf('TXCHK_B')) === 1);

    out('--- 2. rollback on error --------------------------------------');
    try {
      await db.withTransaction(async () => {
        await seed('TXCHK_ROLLBACK', 5);
        throw new Error('simulated failure');
      });
    } catch (error) {
      out(`      (caught: ${error.message})`);
    }
    check('first write rolled back, no orphan row', (await countOf('TXCHK_ROLLBACK')) === 0);

    out('--- 3. rollback on constraint violation -----------------------');
    try {
      await db.withTransaction(async () => {
        await seed('TXCHK_CONSTRAINT', 5);
        await db.execute('INSERT INTO donations (facility_id, user_id, amount) VALUES (999999, 1, 5)');
      });
    } catch (error) {
      out(`      (caught: ${error.code})`);
    }
    check('earlier write rolled back when the FK failed', (await countOf('TXCHK_CONSTRAINT')) === 0);

    out('--- 4. nested transaction uses a savepoint --------------------');
    await db.withTransaction(async () => {
      await seed('TXCHK_OUTER', 5);
      try {
        await db.withTransaction(async () => {
          await seed('TXCHK_INNER', 5);
          throw new Error('inner failure');
        });
      } catch (error) {
        /* expected */
      }
    });
    check('outer row committed', (await countOf('TXCHK_OUTER')) === 1);
    check('inner row rolled back to the savepoint only', (await countOf('TXCHK_INNER')) === 0);

    out('--- 5. read-modify-write is atomic ---------------------------');
    await seed('TXCHK_RMW', 10);
    const rmwId = await idOf('TXCHK_RMW');
    try {
      await db.withTransaction(async () => {
        await setCapacity(rmwId, 42);
        check('own connection sees its own uncommitted write', (await capacityIn(rmwId)) === 42);
        check('other connection still sees the old value', Number(await capacityOut(rmwId)) === 10);
        throw new Error('simulated failure');
      });
    } catch (error) {
      /* expected */
    }
    check('capacity rolled back to 10', (await capacityIn(rmwId)) === 10);

    out('--- 6. concurrent transactions --------------------------------');
    await seed('TXCHK_CONC', 1);
    const concId = await idOf('TXCHK_CONC');
    const worker = () => db.withTransaction(async () => {
      await db.execute(
        'INSERT INTO emergency_contacts (facility_id, contact_name, contact_phone) VALUES (?, ?, ?)',
        [concId, 'TXCHK_C', 'tx-check']
      );
      await db.execute(
        'INSERT INTO emergency_contacts (facility_id, contact_name, contact_phone) VALUES (?, ?, ?)',
        [concId, 'TXCHK_D', 'tx-check']
      );
    });
    await Promise.all([worker(), worker(), worker()]);
    const [made] = await outside('SELECT COUNT(*) n FROM emergency_contacts WHERE facility_id = ?', [concId]);
    check('3 concurrent 2-statement transactions all landed (6 rows)', made[0].n === 6, `rows=${made[0].n}`);

    out('--- 7. no connection leak -------------------------------------');
    for (let i = 0; i < 30; i += 1) {
      await db.withTransaction(async () => facilityModel.getFacilityById(999999));
    }
    check('30 sequential transactions, context clean', db.isInTransaction() === false);
  } finally {
    out('--- cleanup --------------------------------------------------');
    await outside("DELETE FROM facilities WHERE facility_name LIKE 'TXCHK\\_%'").catch(() => {});
    await outside("DELETE FROM emergency_contacts WHERE contact_name LIKE 'TXCHK\\_%'").catch(() => {});
    const [left] = await outside(
      "SELECT COUNT(*) n FROM facilities WHERE facility_name LIKE 'TXCHK\\_%'"
    ).catch(() => [[{ n: -1 }]]);
    check('no residue left in the database', left[0].n === 0, `rows=${left[0].n}`);
    await observer.end();
  }
};

run()
  .then(() => {
    out(failures ? `\n${failures} CHECK(S) FAILED` : '\nALL TRANSACTION CHECKS PASSED');
    process.exit(failures ? 1 : 0);
  })
  .catch((error) => {
    out(`ERROR ${error && (error.stack || error.message)}`);
    process.exit(1);
  });
