const userModel = require('../models/userModel');

// Adnan: works of the code - validate all user-facing registration and login requests
const validateUserInput = (data, { requirePassword = true } = {}) => {
  const { full_name, email, password, phone, role } = data;
  const errors = [];

  if (!full_name || !String(full_name).trim()) errors.push('full_name is required');
  if (!email || !String(email).trim()) errors.push('email is required');
  if (requirePassword && (!password || !String(password).trim())) errors.push('password is required');
  if (role && !['user', 'admin'].includes(role)) errors.push('role must be user or admin');

  return errors;
};

const registerUser = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      role: 'user',
    };

    const errors = validateUserInput(payload);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const existingUser = await userModel.findUserByEmail(String(payload.email).trim().toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const userId = await userModel.createUser(payload);
    const user = await userModel.getUserById(userId);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await userModel.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = await userModel.getUserById(user.user_id);
    return res.status(200).json({
      message: 'Login successful',
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to login user', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validateUserInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const userId = await userModel.createUser(req.body);
    const user = await userModel.getUserById(userId);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const existing = await userModel.getUserById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'User not found' });

    const errors = validateUserInput(req.body, { requirePassword: false });
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await userModel.updateUser(req.params.id, req.body);
    const user = await userModel.getUserById(req.params.id);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const existing = await userModel.getUserById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'User not found' });

    await userModel.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

const getAllUsersWithReviews = async (req, res) => {
  try {
    const users = await userModel.getUsersWithReviews();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users with reviews', error: error.message });
  }
};

// A- Controller for GROUP BY + HAVING: active users with total activities
const getActiveUsersHaving = async (req, res) => {
  try {
    const min = Number(req.query.min) || 2;
    const data = await userModel.getActiveUsersHaving(min);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active users HAVING', error: error.message });
  }
};

// A- Controller for Subquery NOT IN: users never donated
const getUsersNeverDonatedSubquery = async (req, res) => {
  try {
    const data = await userModel.getUsersNeverDonatedSubquery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users subquery NOT IN', error: error.message });
  }
};

// A- Controller for Subquery: users above average donation
const getUsersAboveAvgDonationSubquery = async (req, res) => {
  try {
    const data = await userModel.getUsersAboveAvgDonationSubquery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users subquery avg', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, getUserById, createUser, updateUser, deleteUser, getAllUsersWithReviews, getActiveUsersHaving, getUsersNeverDonatedSubquery, getUsersAboveAvgDonationSubquery };
