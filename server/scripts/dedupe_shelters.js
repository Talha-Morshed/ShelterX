const db = require('../config/db');
(async () => {
  try {
    const dup = await db.execute("SELECT shelter_name, COUNT(*) as c FROM shelters GROUP BY shelter_name HAVING c>1");
    console.log('FOUND_DUPLICATES', dup[0]);
    if (!dup[0] || dup[0].length === 0) {
      console.log('NO_DUPLICATES');
      process.exit(0);
    }
    // Delete duplicates keeping the smallest shelter_id for each name
    await db.execute("DELETE FROM shelters WHERE shelter_id NOT IN (SELECT MIN(shelter_id) FROM shelters GROUP BY shelter_name)");
    const after = await db.execute("SELECT shelter_name, COUNT(*) as c FROM shelters GROUP BY shelter_name HAVING c>1");
    console.log('AFTER_DUPLICATES', after[0]);
  } catch (e) {
    console.error('DEDUPE_ERR', e && e.message);
    process.exit(1);
  }
  process.exit(0);
})();
