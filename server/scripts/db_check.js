const db = require('../config/db');
const fs = require('fs');
(async () => {
  try {
    const v = await db.execute("SELECT sqlite_version() as v");
    console.log('SQLITE_VER', v[0]);
    console.log('DB_FILE_EXISTS', fs.existsSync('./data/shelterx.sqlite'));

    const insertSql = `INSERT INTO shelters (shelter_name, shelter_type, address, city, phone, capacity, available_spaces, description, latitude, longitude, created_at, updated_at) VALUES ('TEST_DB_CONN', 'Test', 'Addr', 'City', '000', 1, 1, 'test', 0, 0, datetime('now'), datetime('now'))`;
    const insertRes = await db.execute(insertSql);
    console.log('INSERT_RES', insertRes[0]);

    const sel = await db.execute('SELECT shelter_id, shelter_name FROM shelters WHERE shelter_name = ?',['TEST_DB_CONN']);
    console.log('SELECT_TEST', sel[0]);

    await db.execute('DELETE FROM shelters WHERE shelter_name = ?',['TEST_DB_CONN']);
    console.log('CLEANUP_DONE');
  } catch (e) {
    console.error('DB_CHECK_ERR', e && (e.code || e.message || e));
    process.exit(1);
  }
  process.exit(0);
})();
