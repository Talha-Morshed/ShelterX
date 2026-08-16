CREATE TABLE IF NOT EXISTS shelters (
  shelter_id INTEGER PRIMARY KEY AUTOINCREMENT,
  shelter_name TEXT NOT NULL,
  shelter_type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  capacity INTEGER NOT NULL,
  available_spaces INTEGER NOT NULL,
  description TEXT,
  latitude REAL,
  longitude REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO shelters (shelter_name, shelter_type, address, city, phone, capacity, available_spaces, description, latitude, longitude)
VALUES
('Downtown Relief Center', 'Shelter', '123 Main St', 'Springfield', '+1 (555) 123-4567', 100, 25, 'Open-admission relief center serving the downtown area.', 37.7749, -122.4194),
('Riverside Food Bank', 'Food Bank', '456 River Rd', 'Rivertown', '+1 (555) 987-6543', 50, 10, 'Community food bank providing emergency supplies.', 34.0522, -118.2437);
