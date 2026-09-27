const db = require('../config/db');
const facilityModel = require('../models/facilityModel');
const userModel = require('../models/userModel');
const serviceModel = require('../models/serviceModel');
const facilityServiceModel = require('../models/facilityServiceModel');
const reviewModel = require('../models/reviewModel');
const donationModel = require('../models/donationModel');
const volunteerModel = require('../models/volunteerModel');
const contactModel = require('../models/emergencyContactModel');

const out = (m) => process.stdout.write(`${m}\n`);

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const countFacilities = async (name) => {
  const [rows] = await db.execute('SELECT COUNT(*) n FROM facilities WHERE facility_name = ?', [name]);
  return rows[0].n;
};

const FACILITIES = [
  { facility_name: 'Riverside Night Shelter', facility_type: 'shelter', address: '18 Wharf Road', city: 'Springfield', state: 'IL', zip_code: '62704', phone: '+1 (555) 200-1101', email: 'intake@riverside-night.org', capacity: 120, available_spaces: 34, description: 'Overnight shelter with 24 hour intake desk and winter overflow capacity.', latitude: '39.781700', longitude: '-89.650100' },
  { facility_name: 'Eastside Community Kitchen', facility_type: 'food_bank', address: '240 Birch Avenue', city: 'Springfield', state: 'IL', zip_code: '62702', phone: '+1 (555) 200-1102', email: 'give@eastside-kitchen.org', capacity: 60, available_spaces: 12, description: 'Daily hot meals and grocery parcels, no referral needed.', latitude: '39.799000', longitude: '-89.644000' },
  { facility_name: 'Northgate Health Clinic', facility_type: 'clinic', address: '7 Halloway Plaza', city: 'Springfield', state: 'IL', zip_code: '62703', phone: '+1 (555) 200-1103', email: 'clinic@northgate-health.org', capacity: 25, available_spaces: 9, description: 'Free walk in clinic for uninsured residents, open weekdays.', latitude: '39.803400', longitude: '-89.651700' },
  { facility_name: 'Hillcrest Youth Center', facility_type: 'community_center', address: '92 Ashgrove Lane', city: 'Springfield', state: 'IL', zip_code: '62711', phone: '+1 (555) 200-1104', email: 'hello@hillcrest-youth.org', capacity: 80, available_spaces: 41, description: 'After school programs, tutoring and a safe evening space for teens.', latitude: '39.759000', longitude: '-89.686000' },
  { facility_name: 'Oakfield Transitional Housing', facility_type: 'housing', address: '310 Oakfield Court', city: 'Springfield', state: 'IL', zip_code: '62712', phone: '+1 (555) 200-1105', email: 'intake@oakfield-housing.org', capacity: 45, available_spaces: 3, description: 'Six month transitional housing with case management support.', latitude: '39.744000', longitude: '-89.698000' },
  { facility_name: 'Lakeside Outreach Van', facility_type: 'other', address: 'Mobile unit, rotates weekly', city: 'Springfield', state: 'IL', zip_code: '62701', phone: '+1 (555) 200-1106', email: 'outreach@lakeside-van.org', capacity: 15, available_spaces: 15, description: 'Mobile intake and supply distribution across three districts.', latitude: '39.820000', longitude: '-89.620000' },
];

const USERS = [
  { full_name: 'Demo Donor', email: 'demo.donor@shelterx.test', password: 'demo1234', phone: '+1 (555) 300-0001', role: 'user' },
  { full_name: 'Demo Reviewer', email: 'demo.reviewer@shelterx.test', password: 'demo1234', phone: '+1 (555) 300-0002', role: 'user' },
  { full_name: 'Demo Volunteer', email: 'demo.volunteer@shelterx.test', password: 'demo1234', phone: '+1 (555) 300-0003', role: 'user' },
  { full_name: 'Ayesha Rahman', email: 'ayesha.rahman@shelterx.test', password: 'demo1234', phone: '+1 (555) 300-0004', role: 'user' },
  { full_name: 'Marcus Bell', email: 'marcus.bell@shelterx.test', password: 'demo1234', phone: '+1 (555) 300-0005', role: 'user' },
];

const SERVICES = [
  { service_name: 'Emergency Housing', service_description: 'Same night shelter placement.', category: 'Housing' },
  { service_name: 'Hot Meals', service_description: 'Breakfast and dinner served daily.', category: 'Food' },
  { service_name: 'Medical Intake', service_description: 'On site nurse and basic wound care.', category: 'Health' },
  { service_name: 'Legal Advice', service_description: 'Weekly drop in with a housing lawyer.', category: 'Support' },
  { service_name: 'Laundry', service_description: 'Washing machines and drying on site.', category: 'Support' },
  { service_name: 'Transport Passes', service_description: 'Bus passes for appointments and interviews.', category: 'Transport' },
];

const run = async () => {
  out('Seeding demo data inside a single transaction...\n');

  const created = await db.withTransaction(async () => {
    const facilityIds = {};

    out('facilities');
    for (const facility of FACILITIES) {
      const [rows] = await db.execute(
        'SELECT facility_id FROM facilities WHERE facility_name = ?',
        [facility.facility_name]
      );
      if (rows[0]) {
        facilityIds[facility.facility_name] = rows[0].facility_id;
        out(`  skip    ${facility.facility_name} (already present)`);
        continue;
      }
      const id = await facilityModel.createFacility({ ...facility, is_active: true });
      facilityIds[facility.facility_name] = id;
      out(`  insert  ${facility.facility_name} -> id ${id}`);
    }

    out('users');
    const userIds = {};
    for (const user of USERS) {
      const [rows] = await db.execute('SELECT user_id FROM users WHERE email = ?', [user.email]);
      if (rows[0]) {
        userIds[user.email] = rows[0].user_id;
        out(`  skip    ${user.email} (already present)`);
        continue;
      }
      const id = await userModel.createUser({
        full_name: user.full_name,
        email: user.email,
        password: hashPassword(user.password),
        phone: user.phone,
        role: user.role,
      });
      userIds[user.email] = id;
      out(`  insert  ${user.email} -> id ${id}`);
    }

    out('services');
    const serviceIds = {};
    for (const service of SERVICES) {
      const [rows] = await db.execute('SELECT service_id FROM services WHERE service_name = ?', [service.service_name]);
      if (rows[0]) {
        serviceIds[service.service_name] = rows[0].service_id;
        out(`  skip    ${service.service_name} (already present)`);
        continue;
      }
      const id = await serviceModel.createService(service);
      serviceIds[service.service_name] = id;
      out(`  insert  ${service.service_name} -> id ${id}`);
    }

    const byName = (name) => facilityIds[name];
    const donor = userIds['demo.donor@shelterx.test'];
    const reviewer = userIds['demo.reviewer@shelterx.test'];
    const volunteerUser = userIds['demo.volunteer@shelterx.test'];
    const ayesha = userIds['ayesha.rahman@shelterx.test'];
    const marcus = userIds['marcus.bell@shelterx.test'];

    out('facility services');
    const links = [
      ['Riverside Night Shelter', 'Emergency Housing'],
      ['Riverside Night Shelter', 'Laundry'],
      ['Riverside Night Shelter', 'Transport Passes'],
      ['Eastside Community Kitchen', 'Hot Meals'],
      ['Eastside Community Kitchen', 'Laundry'],
      ['Northgate Health Clinic', 'Medical Intake'],
      ['Northgate Health Clinic', 'Legal Advice'],
      ['Hillcrest Youth Center', 'Laundry'],
      ['Hillcrest Youth Center', 'Transport Passes'],
      ['Oakfield Transitional Housing', 'Emergency Housing'],
      ['Oakfield Transitional Housing', 'Legal Advice'],
      ['Lakeside Outreach Van', 'Hot Meals'],
    ];
    for (const [facilityName, serviceName] of links) {
      const [rows] = await db.execute(
        'SELECT id FROM facility_services WHERE facility_id = ? AND service_id = ?',
        [byName(facilityName), serviceIds[serviceName]]
      );
      if (rows[0]) {
        out(`  skip    ${facilityName} / ${serviceName}`);
        continue;
      }
      await facilityServiceModel.createFacilityService({
        facility_id: byName(facilityName),
        service_id: serviceIds[serviceName],
        is_available: true,
        notes: null,
      });
      out(`  insert  ${facilityName} / ${serviceName}`);
    }

    out('reviews');
    const reviews = [
      ['Riverside Night Shelter', reviewer, 5, 'Warm welcome at 2am and the laundry room was clean.'],
      ['Riverside Night Shelter', ayesha, 4, 'Good place but the intake queue was long on Friday.'],
      ['Eastside Community Kitchen', marcus, 5, 'Best hot meal in the city and nobody asks questions.'],
      ['Northgate Health Clinic', reviewer, 4, 'Nurse was thorough. Bring your own gloves if you have them.'],
      ['Hillcrest Youth Center', ayesha, 5, 'My daughter has a tutor here twice a week. Genuinely caring staff.'],
      ['Oakfield Transitional Housing', marcus, 3, 'Solid housing but the case meetings are slow to schedule.'],
      ['Lakeside Outreach Van', ayesha, 4, 'The van came to my block and I got a bus pass the same day.'],
    ];
    for (const [facilityName, userId, rating, comment] of reviews) {
      await reviewModel.createReview({ facility_id: byName(facilityName), user_id: userId, rating, comment });
      out(`  insert  ${rating} star review on ${facilityName}`);
    }

    out('donations');
    const donations = [
      ['Riverside Night Shelter', donor, 250, 'money', 'Monthly supporter, winter appeal.'],
      ['Riverside Night Shelter', ayesha, 75, 'supplies', 'Blankets and pillows.'],
      ['Eastside Community Kitchen', donor, 180, 'money', ''],
      ['Eastside Community Kitchen', marcus, 40, 'food', 'Tinned goods, shelf stable milk.'],
      ['Northgate Health Clinic', ayesha, 300, 'money', 'For the bandage and glove fund.'],
      ['Hillcrest Youth Center', donor, 120, 'supplies', 'Board games and art supplies.'],
      ['Lakeside Outreach Van', marcus, 95, 'clothing', 'Winter coats, all sizes.'],
    ];
    for (const [facilityName, userId, amount, donationType, notes] of donations) {
      await donationModel.createDonation({
        facility_id: byName(facilityName),
        user_id: userId,
        amount,
        donation_type: donationType,
        notes,
      });
      out(`  insert  ${donationType} donation to ${facilityName}`);
    }

    out('volunteers');
    const volunteers = [
      ['Riverside Night Shelter', volunteerUser, 'Night shift intake', 'Weekends', 'approved'],
      ['Eastside Community Kitchen', volunteerUser, 'Meal service', 'Tuesday and Thursday evenings', 'approved'],
      ['Northgate Health Clinic', ayesha, 'Front desk', 'Weekday mornings', 'pending'],
      ['Hillcrest Youth Center', marcus, 'Tutor', 'Tuesday afternoons', 'approved'],
      ['Lakeside Outreach Van', ayesha, 'Route driver', 'Flexible', 'pending'],
    ];
    for (const [facilityName, userId, role, availability, status] of volunteers) {
      await volunteerModel.createVolunteer({ facility_id: byName(facilityName), user_id: userId, role, availability, status });
      out(`  insert  volunteer (${status}) at ${facilityName}`);
    }

    out('emergency contacts');
    const contacts = [
      ['Riverside Night Shelter', 'Dana Whitfield, Duty Manager', '+1 (555) 200-9001', 'Duty manager', true],
      ['Eastside Community Kitchen', 'Chef Marco Ruiz', '+1 (555) 200-9002', 'Kitchen lead', true],
      ['Northgate Health Clinic', 'Nurse Practitioner On Call', '+1 (555) 200-9003', 'Clinical', true],
      ['Hillcrest Youth Center', 'Rosa Delgado, Coordinator', '+1 (555) 200-9004', 'Programme coordinator', true],
      ['Oakfield Transitional Housing', 'Case Manager Desk', '+1 (555) 200-9005', 'Case management', true],
      ['Lakeside Outreach Van', 'Dispatch Radio', '+1 (555) 200-9006', 'Dispatch', true],
    ];
    for (const [facilityName, contactName, contactPhone, contactRole, isPrimary] of contacts) {
      await contactModel.createContact({
        facility_id: byName(facilityName),
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_role: contactRole,
        is_primary: isPrimary,
      });
      out(`  insert  contact for ${facilityName}`);
    }

    out('\ncapacity changes (these fire the audit trigger, so they write facility_capacity_history)');
    const changes = [
      ['Riverside Night Shelter', 140, 22, 'winter overflow beds opened'],
      ['Eastside Community Kitchen', 75, 6, 'demand up, added prep slots'],
      ['Oakfield Transitional Housing', 45, 0, 'full, waiting list opened'],
      ['Northgate Health Clinic', 30, 17, 'second nurse on weekdays'],
    ];
    for (const [facilityName, capacity, available, note] of changes) {
      const current = await facilityModel.getFacilityById(byName(facilityName));
      await facilityModel.updateFacility(byName(facilityName), {
        ...current,
        capacity,
        available_spaces: available,
      });
      out(`  update  ${facilityName}: ${current.capacity}/${current.available_spaces} -> ${capacity}/${available}  (${note})`);
    }

    return { facilityIds, userIds };
  });

  const [history] = await db.execute('SELECT COUNT(*) n FROM facility_capacity_history');
  out(`\ncommitted. facility_capacity_history now has ${history[0].n} audit rows`);

  out('\ndemonstrating a rollback');
  const ghostName = 'TX_ROLLBACK_DEMO';
  try {
    await db.withTransaction(async () => {
      const id = await facilityModel.createFacility({
        facility_name: ghostName,
        facility_type: 'other',
        address: 'should never persist',
        city: 'nowhere',
        state: null,
        zip_code: null,
        phone: null,
        email: null,
        capacity: 1,
        available_spaces: 1,
        description: 'this row is rolled back',
        latitude: null,
        longitude: null,
        is_active: true,
      });
      out(`  inserted ${ghostName} -> id ${id} (not yet committed)`);
      throw new Error('simulated crash before commit');
    });
  } catch (error) {
    out(`  caught: ${error.message}`);
  }
  const ghostCount = await countFacilities(ghostName);
  out(`  rows named ${ghostName} in the database now: ${ghostCount} (rollback worked)`);

  const [totals] = await db.execute(`
    SELECT
      (SELECT COUNT(*) FROM facilities) facilities,
      (SELECT COUNT(*) FROM users) users,
      (SELECT COUNT(*) FROM services) services,
      (SELECT COUNT(*) FROM facility_services) facility_services,
      (SELECT COUNT(*) FROM reviews) reviews,
      (SELECT COUNT(*) FROM donations) donations,
      (SELECT COUNT(*) FROM volunteers) volunteers,
      (SELECT COUNT(*) FROM emergency_contacts) emergency_contacts,
      (SELECT COUNT(*) FROM facility_capacity_history) capacity_history
  `);
  out('\nrow counts:');
  for (const [table, count] of Object.entries(totals[0])) {
    out(`  ${table.padEnd(20)} ${count}`);
  }

  out('\nsign in at http://localhost:5173 with');
  out('  demo.donor@shelterx.test / demo1234');
  out('  demo.reviewer@shelterx.test / demo1234');
  out('  demo.volunteer@shelterx.test / demo1234');
  out('  ayesha.rahman@shelterx.test / demo1234');
  out('  marcus.bell@shelterx.test / demo1234');
  out('\nadmin panel PIN: 1234');
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    out(`ERROR ${error && (error.stack || error.message)}`);
    process.exit(1);
  });
