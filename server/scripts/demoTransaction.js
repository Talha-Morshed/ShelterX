const db = require('../config/db');
const facilityModel = require('../models/facilityModel');
const mysql = require('mysql2/promise');

const out = (m) => process.stdout.write(`${m}\n`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mode = process.argv[2] || 'both';

const run = async () => {
  const observer = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
  });

  const target = 'Riverside Night Shelter';
  const [rows] = await observer.query('SELECT facility_id FROM facilities WHERE facility_name = ?', [target]);
  const id = rows[0].facility_id;

  const capacitySeenByOther = async () =>
    (await observer.query('SELECT capacity, available_spaces FROM facilities WHERE facility_id = ?', [id]))[0][0];

  out('='.repeat(64));
  out(`Watching facility "${target}" (id ${id}) from two separate connections.`);
  out('Connection A = the transaction.   Connection B = an outside observer.');
  out('='.repeat(64));

  const showRollback = async () => {
    out('\n>>> DEMO 1: ROLLBACK - writes are thrown away\n');

    const before = await capacitySeenByOther();
    out(`B sees now:  capacity ${before.capacity}, available ${before.available_spaces}`);

    try {
      await db.withTransaction(async () => {
        out('\nA: BEGIN');

        await facilityModel.updateFacility(id, {
          ...(await facilityModel.getFacilityById(id)),
          capacity: 999,
          available_spaces: 1,
        });
        out('A: wrote capacity = 999  (not committed yet)');

        const during = await capacitySeenByOther();
        out(`B sees now:  capacity ${during.capacity}, available ${during.available_spaces}   <- unchanged`);

        const own = await facilityModel.getFacilityById(id);
        out(`A sees now:  capacity ${own.capacity}   <- its own uncommitted write`);

        out('\nA: about to crash before COMMIT...');
        await wait(1500);
        throw new Error('simulated crash');
      });
    } catch (error) {
      out(`A: ROLLBACK (${error.message})`);
    }

    const after = await capacitySeenByOther();
    out(`B sees now:  capacity ${after.capacity}, available ${after.available_spaces}   <- 999 never existed`);
    out('\nResult: A wrote 999, then lost it. B never saw 999 at any point.');
  };

  const showCommit = async () => {
    out('\n\n>>> DEMO 2: COMMIT - writes are kept\n');

    const before = await capacitySeenByOther();
    out(`B sees now:  capacity ${before.capacity}, available ${before.available_spaces}`);

    const target2 = Number(before.capacity) + 10;
    await db.withTransaction(async () => {
      out('\nA: BEGIN');
      await facilityModel.updateFacility(id, {
        ...(await facilityModel.getFacilityById(id)),
        capacity: target2,
        available_spaces: 3,
      });
      out(`A: wrote capacity = ${target2}  (not committed yet)`);

      const during = await capacitySeenByOther();
      out(`B sees now:  capacity ${during.capacity}   <- still the old value`);

      out('\nA: COMMIT');
      await wait(1500);
    });
    out('A: committed');

    const after = await capacitySeenByOther();
    out(`B sees now:  capacity ${after.capacity}, available ${after.available_spaces}   <- now visible`);

    const [history] = await observer.query(
      'SELECT history_id, old_capacity, new_capacity FROM facility_capacity_history WHERE facility_id = ? ORDER BY history_id DESC LIMIT 1',
      [id]
    );
    if (history[0]) {
      out(`\nSide effect: the audit trigger wrote facility_capacity_history row ${history[0].history_id} (${history[0].old_capacity} -> ${history[0].new_capacity})`);
      out('That second INSERT is part of the same transaction, so it cannot exist without the UPDATE.');
    }
  };

  if (mode === 'rollback' || mode === 'both') await showRollback();
  if (mode === 'commit' || mode === 'both') await showCommit();

  out('\n' + '='.repeat(64));
  out('That is the whole idea: a group of writes that all succeed, or none of them do.');
  out('='.repeat(64));

  await observer.end();
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    out(`ERROR ${error && (error.stack || error.message)}`);
    process.exit(1);
  });
