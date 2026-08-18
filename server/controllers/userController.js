const userModel = require('../models/userModel');

const validateUserInput = (data) => {
  const { full_name, email, password, phone, role } = data;
  const errors = [];

  if (!full_name || !String(full_name).trim()) errors.push('full_name is required');
  if (!email || !String(email).trim()) errors.push('email is required');
  if (!password || !String(password).trim()) errors.push('password is required');
  if (role && !['user', 'admin'].includes(role)) errors.push('role must be user or admin');

  return errors;
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

    const errors = validateUserInput(req.body);
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

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
