CREATE DATABASE IF NOT EXISTS shelterx;
USE shelterx;

CREATE TABLE IF NOT EXISTS shelters (
  shelter_id INT AUTO_INCREMENT PRIMARY KEY,
  shelter_name VARCHAR(255) NOT NULL,
  shelter_type VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  capacity INT NOT NULL,
  available_spaces INT NOT NULL,
  description TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO shelters (shelter_name, shelter_type, address, city, phone, capacity, available_spaces, description, latitude, longitude)
VALUES
('Downtown Relief Center', 'Shelter', '123 Main St', 'Springfield', '+1 (555) 123-4567', 100, 25, 'Open-admission relief center serving the downtown area.', 37.7749, -122.4194),
('Riverside Food Bank', 'Food Bank', '456 River Rd', 'Rivertown', '+1 (555) 987-6543', 50, 10, 'Community food bank providing emergency supplies.', 34.0522, -118.2437);
