-- ============================================================
-- ShelterX - JOIN Operations (Viva Reference)
-- Tables: facilities, users, services, facility_services,
--         reviews, donations, volunteers, emergency_contacts
-- ============================================================


-- ************************************************************
-- 1. INNER JOIN
-- ************************************************************
-- WHAT: Returns only rows that have matching values in BOTH tables.
-- WHY:  Used when you need related data and want to skip
--        orphan/unmatched rows.
-- WHERE: Most of your existing controller queries (donations,
--         reviews, volunteers, etc.) use this.


-- Q1: Show each donation with the donor name and facility name.
-- WHY: The donations table only stores user_id and facility_id.
--       We need to JOIN users and facilities to get human-readable names.
SELECT d.donation_id, d.amount, d.donation_type, d.notes,
       u.full_name  AS donor_name,
       f.facility_name
FROM   donations d
INNER JOIN users     u ON d.user_id     = u.user_id
INNER JOIN facilities f ON d.facility_id = f.facility_id
ORDER BY d.donation_id DESC;


-- Q2: Show each review with reviewer name and facility name.
SELECT r.review_id, r.rating, r.comment,
       u.full_name   AS reviewer,
       f.facility_name
FROM   reviews r
INNER JOIN users     u ON r.user_id     = u.user_id
INNER JOIN facilities f ON r.facility_id = f.facility_id
ORDER BY r.review_id DESC;


-- Q3: Show all services available at each facility.
-- WHY: facility_services is a many-to-many bridge table.
--       We need to JOIN both directions to get readable names.
SELECT f.facility_name, s.service_name, s.category, fs.is_available
FROM   facility_services fs
INNER JOIN facilities f ON fs.facility_id = f.facility_id
INNER JOIN services   s ON fs.service_id  = s.service_id
ORDER BY f.facility_name, s.service_name;


-- Q4: Show each volunteer assignment with user and facility info.
SELECT v.volunteer_id, v.role, v.status,
       u.full_name     AS volunteer_name,
       f.facility_name
FROM   volunteers v
INNER JOIN users     u ON v.user_id     = u.user_id
INNER JOIN facilities f ON v.facility_id = f.facility_id
ORDER BY v.volunteer_id DESC;


-- Q5: Show emergency contacts with facility name.
SELECT ec.contact_name, ec.contact_phone, ec.contact_role, ec.is_primary,
       f.facility_name
FROM   emergency_contacts ec
INNER JOIN facilities f ON ec.facility_id = f.facility_id
ORDER BY f.facility_name, ec.is_primary DESC;


-- Q6: Facilities that have at least one donation (only matched rows).
-- WHY: Demonstrates that INNER JOIN naturally filters out facilities
--       with zero donations -- they simply won't appear.
SELECT DISTINCT f.facility_name, f.city
FROM   facilities f
INNER JOIN donations d ON f.facility_id = d.facility_id;


-- ************************************************************
-- 2. LEFT JOIN (LEFT OUTER JOIN)
-- ************************************************************
-- WHAT: Returns ALL rows from the left table, and matching rows
--        from the right table. If no match, NULL is filled in
--        for the right-side columns.
-- WHY:  Used when you want every record from the main table,
--        even if related data doesn't exist.
-- WHERE: Useful for reports -- e.g., "show ALL facilities,
--         and their review count (even if 0)".


-- Q1: List ALL facilities and their reviews (including facilities
--     with zero reviews).
-- WHY: INNER JOIN would hide facilities with no reviews.
--       LEFT JOIN keeps them and shows NULL for review columns.
SELECT f.facility_id, f.facility_name, f.city,
       r.review_id, r.rating, r.comment
FROM   facilities f
LEFT JOIN reviews r ON f.facility_id = r.facility_id
ORDER BY f.facility_name;


-- Q2: List ALL users and their donation history (including users
--     who have never donated).
SELECT u.user_id, u.full_name, u.email,
       d.donation_id, d.amount, d.donation_type
FROM   users u
LEFT JOIN donations d ON u.user_id = d.user_id
ORDER BY u.full_name;


-- Q3: List ALL facilities and how many volunteers each has
--     (including facilities with zero volunteers).
-- WHY: Uses GROUP BY with LEFT JOIN to count related rows.
SELECT f.facility_name, f.city,
       COUNT(v.volunteer_id) AS volunteer_count
FROM   facilities f
LEFT JOIN volunteers v ON f.facility_id = v.facility_id
GROUP BY f.facility_id, f.facility_name, f.city
ORDER BY volunteer_count DESC;


-- Q4: List ALL services and which facilities offer them
--     (including services not offered anywhere yet).
SELECT s.service_name, s.category,
       fs.facility_id, f.facility_name
FROM   services s
LEFT JOIN facility_services fs ON s.service_id  = fs.service_id
LEFT JOIN facilities        f  ON fs.facility_id = f.facility_id
ORDER BY s.service_name;


-- Q5: List ALL facilities and their primary emergency contact
--     (including facilities that have none).
SELECT f.facility_name, f.phone,
       ec.contact_name AS primary_contact,
       ec.contact_phone
FROM   facilities f
LEFT JOIN emergency_contacts ec
       ON f.facility_id = ec.facility_id
      AND ec.is_primary = TRUE
ORDER BY f.facility_name;


-- ************************************************************
-- 3. RIGHT JOIN (RIGHT OUTER JOIN)
-- ************************************************************
-- WHAT: Returns ALL rows from the right table, and matching rows
--        from the left table. If no match, NULL is filled in
--        for the left-side columns.
-- WHY:  Mirror of LEFT JOIN. Used when the "complete" table is
--        on the right side of the JOIN.
-- WHERE: Less common in practice, but useful in exams to show
--         you understand the symmetry with LEFT JOIN.
-- NOTE: In MySQL, RIGHT JOIN is fully supported.


-- Q1: List ALL users and any reviews they've written
--     (including users who have never written a review).
-- WHY: RIGHT JOIN so users (right table) are always shown.
SELECT r.review_id, r.rating, r.comment,
       u.user_id, u.full_name, u.email
FROM   reviews r
RIGHT JOIN users u ON r.user_id = u.user_id
ORDER BY u.full_name;


-- Q2: List ALL services and the facilities that use them
--     (including services not assigned to any facility).
SELECT f.facility_name, f.city,
       s.service_id, s.service_name, s.category
FROM   facility_services fs
RIGHT JOIN services   s  ON fs.service_id  = s.service_id
LEFT  JOIN facilities f  ON fs.facility_id = f.facility_id
ORDER BY s.service_name;


-- Q3: List ALL facilities and any donations received
--     (including facilities with zero donations).
SELECT d.donation_id, d.amount, d.donation_type,
       f.facility_id, f.facility_name, f.city
FROM   donations d
RIGHT JOIN facilities f ON d.facility_id = f.facility_id
ORDER BY f.facility_name;


-- Q4: List ALL users and their volunteer status
--     (including users who are not volunteers).
SELECT v.volunteer_id, v.role, v.status,
       u.user_id, u.full_name, u.email
FROM   volunteers v
RIGHT JOIN users u ON v.user_id = u.user_id
ORDER BY u.full_name;


-- ************************************************************
-- 4. FULL JOIN (FULL OUTER JOIN)
-- ************************************************************
-- WHAT: Returns ALL rows from BOTH tables. If there is no match
--        on either side, NULL is filled in for the missing side.
-- WHY:  Shows everything from both tables regardless of match.
-- WHERE: MySQL does NOT directly support FULL JOIN syntax.
--        We simulate it using UNION of LEFT JOIN + RIGHT JOIN.
-- NOTE: This is a common viva question -- "How to do FULL JOIN
--        in MySQL?" Answer: UNION of LEFT + RIGHT.


-- Q1: FULL JOIN between users and reviews
--     (show ALL users AND ALL reviews, matched where possible).
SELECT u.user_id, u.full_name, r.review_id, r.rating
FROM   users u
LEFT  JOIN reviews r ON u.user_id = r.user_id
UNION
SELECT u.user_id, u.full_name, r.review_id, r.rating
FROM   users u
RIGHT JOIN reviews r ON u.user_id = r.user_id
ORDER BY user_id;


-- Q2: FULL JOIN between facilities and donations
--     (every facility and every donation, matched where possible).
SELECT f.facility_id, f.facility_name,
       d.donation_id, d.amount
FROM   facilities f
LEFT  JOIN donations d ON f.facility_id = d.facility_id
UNION
SELECT f.facility_id, f.facility_name,
       d.donation_id, d.amount
FROM   facilities f
RIGHT JOIN donations d ON f.facility_id = d.facility_id
ORDER BY facility_id;


-- Q3: FULL JOIN between facilities and volunteers
SELECT f.facility_id, f.facility_name,
       v.volunteer_id, v.role, v.status
FROM   facilities f
LEFT  JOIN volunteers v ON f.facility_id = v.facility_id
UNION
SELECT f.facility_id, f.facility_name,
       v.volunteer_id, v.role, v.status
FROM   facilities f
RIGHT JOIN volunteers v ON f.facility_id = v.facility_id
ORDER BY facility_id;


-- Q4: FULL JOIN between services and facility_services
SELECT s.service_id, s.service_name, s.category,
       fs.facility_id, fs.is_available
FROM   services s
LEFT  JOIN facility_services fs ON s.service_id = fs.service_id
UNION
SELECT s.service_id, s.service_name, s.category,
       fs.facility_id, fs.is_available
FROM   services s
RIGHT JOIN facility_services fs ON s.service_id = fs.service_id
ORDER BY service_id;


-- ************************************************************
-- BONUS: Multi-table complex JOINs (impress in viva)
-- ************************************************************

-- B1: Facility dashboard -- name, city, total donations,
--     average rating, volunteer count (all in one query).
-- WHY: Demonstrates aggregation across multiple JOINed tables.
SELECT f.facility_id,
       f.facility_name,
       f.city,
       f.capacity,
       COALESCE(SUM(d.amount), 0)          AS total_donations,
       ROUND(AVG(r.rating), 1)             AS avg_rating,
       COUNT(DISTINCT v.volunteer_id)      AS volunteer_count,
       COUNT(DISTINCT ec.contact_id)       AS emergency_contacts
FROM   facilities f
LEFT JOIN donations           d  ON f.facility_id = d.facility_id
LEFT JOIN reviews             r  ON f.facility_id = r.facility_id
LEFT JOIN volunteers          v  ON f.facility_id = v.facility_id
LEFT JOIN emergency_contacts  ec ON f.facility_id = ec.facility_id
GROUP BY f.facility_id, f.facility_name, f.city, f.capacity
ORDER BY total_donations DESC;


-- B2: Find facilities that offer Medical services
--     (demonstrates filtering on JOINed table).
SELECT f.facility_name, f.city, s.service_name, s.category
FROM   facilities f
INNER JOIN facility_services fs ON f.facility_id = fs.facility_id
INNER JOIN services          s  ON fs.service_id = s.service_id
WHERE  s.category = 'Medical'
ORDER BY f.city;


-- B3: Find users who are both donors AND volunteers
--     (demonstrates INTERSECT-like logic with INNER JOIN).
SELECT DISTINCT u.full_name, u.email
FROM   users u
INNER JOIN donations  d ON u.user_id = d.user_id
INNER JOIN volunteers v ON u.user_id = v.user_id;

-- ============================================================
-- A- NEW: GROUP BY + HAVING + SUBQUERY Examples (Assignment)
-- ============================================================

-- A- GROUP BY + HAVING: Facilities having at least 2 reviews with avg rating >=4
SELECT f.facility_name, f.city, COUNT(r.review_id) AS total_reviews, ROUND(AVG(r.rating),1) AS avg_rating
FROM facilities f JOIN reviews r ON f.facility_id = r.facility_id
GROUP BY f.facility_id, f.facility_name, f.city
HAVING total_reviews >= 2 AND avg_rating >= 4;

-- A- GROUP BY + HAVING: Cities having 2+ facilities (demonstrates HAVING on COUNT)
SELECT city, COUNT(*) AS facility_count
FROM facilities
GROUP BY city
HAVING facility_count >= 2;

-- A- GROUP BY + HAVING: Facility types with total capacity >=100
SELECT facility_type, SUM(capacity) AS total_capacity, COUNT(*) AS type_count
FROM facilities
GROUP BY facility_type
HAVING total_capacity >= 100;

-- A- GROUP BY + HAVING: Donation totals per facility with HAVING filter
SELECT f.facility_name, SUM(d.amount) AS total_amount
FROM facilities f LEFT JOIN donations d ON f.facility_id = d.facility_id
GROUP BY f.facility_id, f.facility_name
HAVING total_amount >= 100;

-- A- GROUP BY + HAVING: Top donors with total donated >=300
SELECT u.full_name, SUM(d.amount) AS total_donated
FROM users u JOIN donations d ON u.user_id = d.user_id
GROUP BY u.user_id, u.full_name
HAVING total_donated >= 300;

-- A- Subquery: Facilities with capacity > average capacity (scalar subquery)
SELECT facility_name, capacity FROM facilities
WHERE capacity > (SELECT AVG(capacity) FROM facilities);

-- A- Subquery IN: Facilities that have donations (IN subquery)
SELECT facility_name FROM facilities
WHERE facility_id IN (SELECT DISTINCT facility_id FROM donations);

-- A- Subquery EXISTS: Facilities with 5-star reviews (EXISTS correlated subquery)
SELECT f.facility_name FROM facilities f
WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.facility_id = f.facility_id AND r.rating = 5);

-- A- Subquery NOT IN: Facilities never reviewed
SELECT facility_name FROM facilities
WHERE facility_id NOT IN (SELECT facility_id FROM reviews);

-- A- Subquery: Donations above average amount
SELECT d.donation_id, d.amount FROM donations d
WHERE d.amount > (SELECT AVG(amount) FROM donations);

-- A- Subquery: Users who never donated (NOT IN)
SELECT full_name FROM users WHERE user_id NOT IN (SELECT user_id FROM donations);

-- A- Subquery: Volunteers who are also donors (IN + IN)
SELECT full_name FROM users
WHERE user_id IN (SELECT user_id FROM volunteers)
  AND user_id IN (SELECT user_id FROM donations);
