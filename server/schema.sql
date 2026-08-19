CREATE DATABASE IF NOT EXISTS shelterx;
USE shelterx;

-- ============================================================
-- 1. facilities
-- ============================================================
CREATE TABLE IF NOT EXISTS facilities (
  facility_id     INT AUTO_INCREMENT PRIMARY KEY,
  facility_name   VARCHAR(255) NOT NULL,
  facility_type   ENUM('shelter','food_bank','clinic','community_center','housing','other') NOT NULL DEFAULT 'shelter',
  address         VARCHAR(255) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(50),
  zip_code        VARCHAR(20),
  phone           VARCHAR(50),
  email           VARCHAR(255),
  capacity        INT NOT NULL DEFAULT 0,
  available_spaces INT NOT NULL DEFAULT 0,
  description     TEXT,
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT chk_capacity         CHECK (capacity >= 0),
  CONSTRAINT chk_available_spaces CHECK (available_spaces >= 0),
  CONSTRAINT chk_spaces_lte_cap   CHECK (available_spaces <= capacity)
);

CREATE INDEX idx_facilities_city       ON facilities (city);
CREATE INDEX idx_facilities_type       ON facilities (facility_type);
CREATE INDEX idx_facilities_active     ON facilities (is_active);
CREATE INDEX idx_facilities_location   ON facilities (latitude, longitude);

-- ============================================================
-- 2. users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  user_id    INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  phone      VARCHAR(50),
  role       ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users (role);

-- ============================================================
-- 3. services  (reusable catalog)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  service_id          INT AUTO_INCREMENT PRIMARY KEY,
  service_name        VARCHAR(100) NOT NULL,
  service_description TEXT,
  category            VARCHAR(100),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON services (category);

-- ============================================================
-- 4. facility_services  (many-to-many join)
-- ============================================================
CREATE TABLE IF NOT EXISTS facility_services (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  facility_id  INT NOT NULL,
  service_id   INT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  notes        TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_fs_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE,
  CONSTRAINT fk_fs_service  FOREIGN KEY (service_id)  REFERENCES services(service_id)   ON DELETE CASCADE,
  CONSTRAINT uq_facility_service UNIQUE (facility_id, service_id)
);

CREATE INDEX idx_fs_facility ON facility_services (facility_id);
CREATE INDEX idx_fs_service  ON facility_services (service_id);

-- ============================================================
-- 5. reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  review_id   INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT NOT NULL,
  user_id     INT NOT NULL,
  rating      TINYINT NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_reviews_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user     FOREIGN KEY (user_id)     REFERENCES users(user_id)          ON DELETE CASCADE,
  CONSTRAINT chk_rating          CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_reviews_facility ON reviews (facility_id);
CREATE INDEX idx_reviews_user     ON reviews (user_id);
CREATE INDEX idx_reviews_rating   ON reviews (rating);

-- ============================================================
-- 6. donations
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  donation_id   INT AUTO_INCREMENT PRIMARY KEY,
  facility_id   INT NOT NULL,
  user_id       INT NOT NULL,
  amount        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  donation_type ENUM('money','food','clothing','supplies','other') NOT NULL DEFAULT 'money',
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_donations_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE,
  CONSTRAINT fk_donations_user     FOREIGN KEY (user_id)     REFERENCES users(user_id)          ON DELETE CASCADE,
  CONSTRAINT chk_donation_amount   CHECK (amount >= 0)
);

CREATE INDEX idx_donations_facility ON donations (facility_id);
CREATE INDEX idx_donations_user     ON donations (user_id);
CREATE INDEX idx_donations_type     ON donations (donation_type);

-- ============================================================
-- 7. volunteers
-- ============================================================
CREATE TABLE IF NOT EXISTS volunteers (
  volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id  INT NOT NULL,
  user_id      INT NOT NULL,
  role         VARCHAR(100),
  availability VARCHAR(255),
  status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_volunteers_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE,
  CONSTRAINT fk_volunteers_user     FOREIGN KEY (user_id)     REFERENCES users(user_id)          ON DELETE CASCADE
);

CREATE INDEX idx_volunteers_facility ON volunteers (facility_id);
CREATE INDEX idx_volunteers_user     ON volunteers (user_id);
CREATE INDEX idx_volunteers_status   ON volunteers (status);

-- ============================================================
-- 8. emergency_contacts
-- ============================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
  contact_id    INT AUTO_INCREMENT PRIMARY KEY,
  facility_id   INT NOT NULL,
  contact_name  VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_role  VARCHAR(100),
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_ec_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE
);

CREATE INDEX idx_ec_facility ON emergency_contacts (facility_id);
CREATE INDEX idx_ec_primary  ON emergency_contacts (facility_id, is_primary);
