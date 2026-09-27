USE shelterx;

CREATE TABLE IF NOT EXISTS donation_deletion_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  donation_id INT NOT NULL,
  facility_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  donation_type VARCHAR(20) NOT NULL,
  donation_created_at DATETIME NOT NULL,
  deleted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_donation_deletion_history_donation_id (donation_id),
  INDEX idx_donation_deletion_history_deleted_at (deleted_at)
);

DELIMITER $$

CREATE TRIGGER trg_donations_delete_audit_ad
AFTER DELETE ON donations
FOR EACH ROW
BEGIN
  INSERT INTO donation_deletion_history (
    donation_id,
    facility_id,
    user_id,
    amount,
    donation_type,
    donation_created_at
  ) VALUES (
    OLD.donation_id,
    OLD.facility_id,
    OLD.user_id,
    OLD.amount,
    OLD.donation_type,
    OLD.created_at
  );
END$$

DELIMITER ;
