USE shelterx;

CREATE TABLE IF NOT EXISTS facility_capacity_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT NOT NULL,
  facility_name VARCHAR(255) NOT NULL,
  old_capacity INT NOT NULL,
  new_capacity INT NOT NULL,
  old_available_spaces INT NOT NULL,
  new_available_spaces INT NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER trg_facilities_capacity_audit_au
AFTER UPDATE ON facilities
FOR EACH ROW
BEGIN
  IF OLD.capacity <> NEW.capacity
      OR OLD.available_spaces <> NEW.available_spaces THEN
    INSERT INTO facility_capacity_history (
      facility_id,
      facility_name,
      old_capacity,
      new_capacity,
      old_available_spaces,
      new_available_spaces,
      changed_at
    ) VALUES (
      NEW.facility_id,
      NEW.facility_name,
      OLD.capacity,
      NEW.capacity,
      OLD.available_spaces,
      NEW.available_spaces,
      CURRENT_TIMESTAMP
    );
  END IF;
END$$

DELIMITER ;