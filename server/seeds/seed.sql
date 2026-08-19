CREATE DATABASE IF NOT EXISTS shelterx;
USE shelterx;

INSERT INTO facilities (facility_name, facility_type, address, city, phone, capacity, available_spaces, description, latitude, longitude)
VALUES
('Downtown Relief Center', 'Shelter', '123 Main St', 'Springfield', '+1 (555) 123-4567', 100, 25, 'Open-admission relief center serving the downtown area.', 37.7749, -122.4194),
('Riverside Food Bank', 'Food Bank', '456 River Rd', 'Rivertown', '+1 (555) 987-6543', 50, 10, 'Community food bank providing emergency supplies.', 34.0522, -118.2437),
('Hillside Women Shelter', 'Shelter', '789 Hill Ave', 'Westview', '+1 (555) 234-5678', 60, 15, 'Safe haven for women and children in crisis.', 40.7128, -74.0060),
('Eastside Youth Center', 'Youth Center', '321 East Blvd', 'Eastborough', '+1 (555) 345-6789', 40, 20, 'Daytime shelter and programs for at-risk youth.', 41.8781, -87.6298),
('Northgate Medical Clinic', 'Medical Clinic', '555 North Gate Dr', 'Northcity', '+1 (555) 456-7890', 30, 8, 'Free medical services for underserved communities.', 29.7604, -95.3698),
('Southside Community Kitchen', 'Food Bank', '888 South Ln', 'Southtown', '+1 (555) 567-8901', 75, 30, 'Hot meals served daily to anyone in need.', 33.4484, -112.0740),
('Lakeside Veteran Home', 'Shelter', '101 Lake Dr', 'Laketown', '+1 (555) 678-9012', 45, 12, 'Dedicated shelter for military veterans experiencing homelessness.', 47.6062, -122.3321),
('Central Pet Rescue', 'Animal Shelter', '202 Central Ave', 'Midtown', '+1 (555) 789-0123', 80, 35, 'Animal shelter providing refuge for abandoned pets.', 39.7392, -104.9903);

INSERT INTO users (full_name, email, password, phone, role)
VALUES
('Alice Johnson', 'alice@example.com', 'hashedpassword1', '+1 (555) 111-2222', 'user'),
('Bob Smith', 'bob@example.com', 'hashedpassword2', '+1 (555) 333-4444', 'admin'),
('Carol White', 'carol@example.com', 'hashedpassword3', '+1 (555) 555-6666', 'user'),
('David Brown', 'david@example.com', 'hashedpassword4', '+1 (555) 777-8888', 'user'),
('Eva Martinez', 'eva@example.com', 'hashedpassword5', '+1 (555) 999-0000', 'user');

INSERT INTO services (service_name, service_description, category)
VALUES
('Emergency Housing', 'Short-term overnight accommodation for individuals and families in crisis.', 'Housing'),
('Food Assistance', 'Distribution of groceries, hot meals, and nutritional support.', 'Food'),
('Medical Services', 'Free or low-cost medical check-ups and basic treatment.', 'Health'),
('Counseling', 'Mental health support and crisis counseling sessions.', 'Health'),
('Job Training', 'Workshops and training programs to improve employment skills.', 'Employment'),
('Clothing Donation', 'Distribution of clothing and essential personal items.', 'Supplies'),
('Veterans Support', 'Specialized services for military veterans including housing and benefits assistance.', 'Specialized'),
('Pet Adoption', 'Animal rescue, fostering, and adoption services.', 'Animals');

INSERT INTO facility_services (facility_id, service_id, is_available, notes)
VALUES
(1, 1, TRUE, 'Available 24/7 during winter months.'),
(1, 2, TRUE, 'Meals served 3 times daily.'),
(2, 2, TRUE, 'Weekly food box distribution every Saturday.'),
(3, 1, TRUE, 'Exclusive to women and children.'),
(3, 4, TRUE, 'On-site counselors available Mon-Fri.'),
(4, 5, TRUE, 'Resume workshops held every Tuesday.'),
(5, 3, TRUE, 'Walk-in clinic hours: 9AM-5PM.'),
(5, 4, TRUE, 'Counseling by appointment.'),
(6, 2, TRUE, 'Hot lunch service from 11AM-2PM.'),
(7, 1, TRUE, 'Veterans only; requires DD-214 verification.'),
(7, 7, TRUE, 'Dedicated veterans benefits coordinator on staff.'),
(8, 8, TRUE, 'Adoption hours: 10AM-4PM daily.');

INSERT INTO reviews (facility_id, user_id, rating, comment)
VALUES
(1, 1, 5, 'Very clean and the staff were incredibly helpful.'),
(1, 3, 4, 'Good facilities but can get crowded on weekends.'),
(2, 2, 5, 'Lifesaver! Food was fresh and portions were generous.'),
(3, 4, 5, 'Felt safe and welcome. Great support services.'),
(5, 1, 3, 'Good medical care but long wait times.'),
(6, 5, 4, 'Warm meals and kind volunteers.'),
(7, 3, 5, 'Finally a shelter that understands veterans needs.'),
(8, 2, 4, 'Adopted my cat here. Very professional staff.');

INSERT INTO donations (facility_id, user_id, amount, donation_type, notes)
VALUES
(1, 1, 50.00, 'money', 'Monthly donation.'),
(2, 2, 100.00, 'money', 'Holiday season contribution.'),
(3, 3, 25.50, 'money', 'Happy to help.'),
(1, 4, 0.00, 'clothing', 'Winter coats and blankets.'),
(6, 5, 75.00, 'money', 'For the kitchen fund.'),
(2, 1, 0.00, 'food', 'Canned goods and rice.'),
(7, 3, 200.00, 'money', 'Veterans day special donation.'),
(4, 2, 0.00, 'supplies', 'School supplies for youth program.');

INSERT INTO volunteers (facility_id, user_id, role, availability, status)
VALUES
(1, 1, 'Front Desk', 'Weekends 9AM-5PM', 'approved'),
(2, 3, 'Food Server', 'Saturdays 10AM-2PM', 'approved'),
(3, 5, 'Counselor Assistant', 'Mon-Fri 1PM-5PM', 'approved'),
(6, 4, 'Kitchen Helper', 'Weekdays 11AM-3PM', 'pending'),
(7, 2, 'Events Coordinator', 'Flexible', 'approved'),
(8, 1, 'Animal Care', 'Sundays 10AM-4PM', 'pending'),
(5, 3, 'Receptionist', 'Tuesdays 9AM-1PM', 'approved'),
(4, 5, 'Tutor', 'Wednesdays 3PM-6PM', 'pending');

INSERT INTO emergency_contacts (facility_id, contact_name, contact_phone, contact_role, is_primary)
VALUES
(1, 'James Carter', '+1 (555) 100-0001', 'Shelter Director', TRUE),
(1, 'Linda Harris', '+1 (555) 100-0002', 'Night Shift Manager', FALSE),
(2, 'Mark Thompson', '+1 (555) 200-0001', 'Operations Manager', TRUE),
(3, 'Sarah Lee', '+1 (555) 300-0001', 'Program Director', TRUE),
(4, 'Tom Wilson', '+1 (555) 400-0001', 'Youth Services Lead', TRUE),
(5, 'Dr. Rachel Green', '+1 (555) 500-0001', 'Medical Director', TRUE),
(6, 'Carlos Ruiz', '+1 (555) 600-0001', 'Kitchen Manager', TRUE),
(7, 'Mike Stevens', '+1 (555) 700-0001', 'Veterans Liaison', TRUE),
(7, 'Angela Davis', '+1 (555) 700-0002', 'Night Supervisor', FALSE),
(8, 'Dr. Emily Wong', '+1 (555) 800-0001', 'Veterinarian', TRUE);
