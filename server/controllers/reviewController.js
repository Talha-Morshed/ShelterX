const reviewModel = require('../models/reviewModel');

const validateReviewInput = (data) => {
  const { facility_id, user_id, rating } = data;
  const errors = [];
  if (!facility_id) errors.push('facility_id is required');
  if (!user_id) errors.push('user_id is required');
  if (!rating || Number(rating) < 1 || Number(rating) > 5) errors.push('rating must be between 1 and 5');
  return errors;
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

const getByFacility = async (req, res) => {
  try {
    const reviews = await reviewModel.getReviewsByFacility(req.params.facilityId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const review = await reviewModel.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch review', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const errors = validateReviewInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const reviewId = await reviewModel.createReview(req.body);
    const review = await reviewModel.getReviewById(reviewId);
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await reviewModel.getReviewById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Review not found' });

    const errors = validateReviewInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await reviewModel.updateReview(req.params.id, req.body);
    const review = await reviewModel.getReviewById(req.params.id);
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await reviewModel.getReviewById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Review not found' });

    await reviewModel.deleteReview(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

module.exports = { getAllReviews, getByFacility, getById, create, update, remove };
