const db = require('../config/db');
(async () => {
  try {
    const v = await db.execute("SELECT VERSION() as v");
    console.log('MYSQL_VER', v[0][0].v);

    const insertSql = `INSERT INTO shelters (shelter_name, shelter_type, address, city, phone, capacity, available_spaces, description, latitude, longitude) VALUES ('TEST_DB_CONN', 'Test', 'Addr', 'City', '000', 1, 1, 'test', 0, 0)`;
    const insertRes = await db.execute(insertSql);
    console.log('INSERT_RES', insertRes[0]);

    const sel = await db.execute('SELECT shelter_id, shelter_name FROM shelters WHERE shelter_name = ?', ['TEST_DB_CONN']);
    console.log('SELECT_TEST', sel[0]);

    await db.execute('DELETE FROM shelters WHERE shelter_name = ?', ['TEST_DB_CONN']);
    console.log('CLEANUP_DONE');
  } catch (e) {
    console.error('DB_CHECK_ERR', e && (e.code || e.message || e));
    process.exit(1);
  }
  process.exit(0);
})();
