const db = require('../config/db');
(async () => {
  try {
    const dup = await db.execute("SELECT facility_name, COUNT(*) as c FROM facilities GROUP BY facility_name HAVING c>1");
    console.log('FOUND_DUPLICATES', dup[0]);
    if (!dup[0] || dup[0].length === 0) {
      console.log('NO_DUPLICATES');
      process.exit(0);
    }
    // Delete duplicates keeping the smallest facility_id for each name
    await db.execute("DELETE FROM facilities WHERE facility_id NOT IN (SELECT MIN(facility_id) FROM facilities GROUP BY facility_name)");
    const after = await db.execute("SELECT facility_name, COUNT(*) as c FROM facilities GROUP BY facility_name HAVING c>1");
    console.log('AFTER_DUPLICATES', after[0]);
  } catch (e) {
    console.error('DEDUPE_ERR', e && e.message);
    process.exit(1);
  }
  process.exit(0);
})();
