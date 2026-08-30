-- ShelterX - GROUP BY, HAVING, and Subquery Examples (Aggregate Functions)

-- GROUP BY + HAVING: Facilities having at least 2 reviews with avg rating >=4
SELECT f.facility_name, f.city, COUNT(r.review_id) AS total_reviews, ROUND(AVG(r.rating),1) AS avg_rating
FROM facilities f JOIN reviews r ON f.facility_id = r.facility_id
GROUP BY f.facility_id, f.facility_name, f.city
HAVING total_reviews >= 2 AND avg_rating >= 4;

-- GROUP BY + HAVING: Cities having 2+ facilities (demonstrates HAVING on COUNT)
SELECT city, COUNT(*) AS facility_count
FROM facilities
GROUP BY city
HAVING facility_count >= 2;

-- GROUP BY + HAVING: Facility types with total capacity >=100
SELECT facility_type, SUM(capacity) AS total_capacity, COUNT(*) AS type_count
FROM facilities
GROUP BY facility_type
HAVING total_capacity >= 100;

-- GROUP BY + HAVING: Donation totals per facility with HAVING filter
SELECT f.facility_name, SUM(d.amount) AS total_amount
FROM facilities f LEFT JOIN donations d ON f.facility_id = d.facility_id
GROUP BY f.facility_id, f.facility_name
HAVING total_amount >= 100;

-- GROUP BY + HAVING: Top donors with total donated >=300
SELECT u.full_name, SUM(d.amount) AS total_donated
FROM users u JOIN donations d ON u.user_id = d.user_id
GROUP BY u.user_id, u.full_name
HAVING total_donated >= 300;

-- Subquery: Facilities with capacity > average capacity (scalar subquery)
SELECT facility_name, capacity FROM facilities
WHERE capacity > (SELECT AVG(capacity) FROM facilities);

-- Subquery IN: Facilities that have donations (IN subquery)
SELECT facility_name FROM facilities
WHERE facility_id IN (SELECT DISTINCT facility_id FROM donations);

-- Subquery EXISTS: Facilities with 5-star reviews (EXISTS correlated subquery)
SELECT f.facility_name FROM facilities f
WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.facility_id = f.facility_id AND r.rating = 5);

-- Subquery NOT IN: Facilities never reviewed
SELECT facility_name FROM facilities
WHERE facility_id NOT IN (SELECT facility_id FROM reviews);

-- Subquery: Donations above average amount
SELECT d.donation_id, d.amount FROM donations d
WHERE d.amount > (SELECT AVG(amount) FROM donations);

-- Subquery: Users who never donated (NOT IN)
SELECT full_name FROM users WHERE user_id NOT IN (SELECT user_id FROM donations);

-- Subquery: Volunteers who are also donors (IN + IN)
SELECT full_name FROM users
WHERE user_id IN (SELECT user_id FROM volunteers)
  AND user_id IN (SELECT user_id FROM donations);
