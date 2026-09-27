CREATE DATABASE IF NOT EXISTS shelterx;
USE shelterx;

-- Adnan - Recreate the facility overview view used by the analytics dashboard.
DROP VIEW IF EXISTS vw_facility_overview;
CREATE VIEW vw_facility_overview AS
SELECT
  f.facility_id,
  f.facility_name,
  f.facility_type,
  f.city,
  f.capacity,
  f.available_spaces,
  (SELECT COUNT(*) FROM reviews r WHERE r.facility_id = f.facility_id) AS review_count,
  (SELECT ROUND(AVG(r.rating), 2) FROM reviews r WHERE r.facility_id = f.facility_id) AS average_rating,
  (SELECT COALESCE(SUM(d.amount), 0) FROM donations d WHERE d.facility_id = f.facility_id) AS total_donations,
  (SELECT COUNT(*) FROM volunteers v WHERE v.facility_id = f.facility_id) AS volunteer_count
FROM facilities f;

-- Adnan - Recreate the service availability view used by the analytics dashboard.
DROP VIEW IF EXISTS vw_service_availability;
CREATE VIEW vw_service_availability AS
SELECT
  f.facility_id,
  f.facility_name,
  f.city,
  s.service_id,
  s.service_name,
  s.category,
  fs.is_available,
  fs.notes
FROM facility_services fs
JOIN facilities f ON f.facility_id = fs.facility_id
JOIN services s ON s.service_id = fs.service_id;

-- Talha - Aggregate donation amounts by type, including population dispersion statistics.
DROP VIEW IF EXISTS vw_donation_type_statistics;
CREATE VIEW vw_donation_type_statistics AS
SELECT
  donation_type,
  COUNT(*) AS donation_count,
  COUNT(DISTINCT user_id) AS distinct_donors,
  ROUND(SUM(amount), 2) AS total_amount,
  ROUND(AVG(amount), 2) AS average_amount,
  MIN(amount) AS minimum_amount,
  MAX(amount) AS maximum_amount,
  ROUND(STDDEV_POP(amount), 2) AS population_stddev,
  ROUND(VAR_POP(amount), 2) AS population_variance
FROM donations
GROUP BY donation_type;

-- Talha - Summarize total and available services for every facility.
DROP VIEW IF EXISTS vw_facility_service_summary;
CREATE VIEW vw_facility_service_summary AS
SELECT
  f.facility_id,
  f.facility_name,
  f.facility_type,
  f.city,
  COUNT(DISTINCT s.service_id) AS service_count,
  COUNT(DISTINCT CASE WHEN fs.is_available = TRUE THEN s.service_id END) AS available_service_count,
  COUNT(DISTINCT CASE WHEN fs.is_available = FALSE THEN s.service_id END) AS unavailable_service_count,
  GROUP_CONCAT(
    DISTINCT CASE WHEN fs.is_available = TRUE THEN s.service_name END
    ORDER BY s.service_name
    SEPARATOR ', '
  ) AS available_service_names
FROM facilities f
LEFT JOIN facility_services fs ON fs.facility_id = f.facility_id
LEFT JOIN services s ON s.service_id = fs.service_id
GROUP BY f.facility_id, f.facility_name, f.facility_type, f.city;

-- Adnan - Recreate a public directory view that omits internal location and audit columns.
DROP VIEW IF EXISTS vw_public_facility_directory;
CREATE VIEW vw_public_facility_directory AS
SELECT
  facility_id,
  facility_name,
  facility_type,
  address,
  city,
  state,
  zip_code,
  phone,
  capacity,
  available_spaces,
  description
FROM facilities
WHERE is_active = TRUE;

-- Adnan - Recreate the capacity procedure that returns facilities at or above a requested capacity.
DROP PROCEDURE IF EXISTS sp_facilities_by_min_capacity;
DELIMITER $$
CREATE PROCEDURE sp_facilities_by_min_capacity(IN p_min_capacity INT)
BEGIN
  SELECT facility_id, facility_name, facility_type, city, capacity, available_spaces
  FROM facilities
  WHERE capacity >= p_min_capacity
  ORDER BY capacity DESC, facility_name ASC;
END$$
DELIMITER ;

-- Adnan - Recreate the activity procedure that returns one facility's review, donation, and volunteer totals.
DROP PROCEDURE IF EXISTS sp_facility_activity_report;
DELIMITER $$
CREATE PROCEDURE sp_facility_activity_report(IN p_city VARCHAR(100))
BEGIN
  SELECT *
  FROM vw_facility_overview
  WHERE p_city IS NULL OR p_city = '' OR city = p_city
  ORDER BY total_donations DESC, review_count DESC, facility_name ASC;
END$$
DELIMITER ;

-- Adnan - Recreate the conditional procedure that chooses a capacity report by threshold.
DROP PROCEDURE IF EXISTS sp_facility_capacity_status;
DELIMITER $$
CREATE PROCEDURE sp_facility_capacity_status(IN p_min_capacity INT)
BEGIN
  IF p_min_capacity <= 0 THEN
    SELECT facility_id, facility_name, facility_type, city, capacity, 'All facilities' AS selection_rule
    FROM facilities
    ORDER BY capacity DESC, facility_name ASC;
  ELSEIF p_min_capacity >= 100 THEN
    SELECT facility_id, facility_name, facility_type, city, capacity, 'High capacity facilities' AS selection_rule
    FROM facilities
    WHERE capacity >= p_min_capacity
    ORDER BY capacity DESC, facility_name ASC;
  ELSE
    SELECT facility_id, facility_name, facility_type, city, capacity, 'Capacity threshold facilities' AS selection_rule
    FROM facilities
    WHERE capacity >= p_min_capacity
    ORDER BY capacity DESC, facility_name ASC;
  END IF;
END$$
DELIMITER ;

-- Adnan - Recreate the loop procedure that builds temporary capacity bands without changing permanent data.
DROP PROCEDURE IF EXISTS sp_facility_capacity_bands;
DELIMITER $$
CREATE PROCEDURE sp_facility_capacity_bands()
BEGIN
  DECLARE v_band INT DEFAULT 0;
  CREATE TEMPORARY TABLE IF NOT EXISTS tmp_capacity_bands (
    band_order INT,
    band_label VARCHAR(50),
    facility_count INT
  );
  DELETE FROM tmp_capacity_bands;

  WHILE v_band < 3 DO
    INSERT INTO tmp_capacity_bands (band_order, band_label, facility_count)
    SELECT
      v_band,
      CASE v_band
        WHEN 0 THEN 'Small (0-49)'
        WHEN 1 THEN 'Medium (50-99)'
        ELSE 'Large (100+)'
      END,
      CASE v_band
        WHEN 0 THEN (SELECT COUNT(*) FROM facilities WHERE capacity < 50)
        WHEN 1 THEN (SELECT COUNT(*) FROM facilities WHERE capacity >= 50 AND capacity < 100)
        ELSE (SELECT COUNT(*) FROM facilities WHERE capacity >= 100)
      END;
    SET v_band = v_band + 1;
  END WHILE;

  SELECT band_label, facility_count
  FROM tmp_capacity_bands
  ORDER BY band_order;
  DROP TEMPORARY TABLE tmp_capacity_bands;
END$$
DELIMITER ;