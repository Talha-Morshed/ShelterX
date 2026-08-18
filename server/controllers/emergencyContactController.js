const contactModel = require('../models/emergencyContactModel');

const validateContactInput = (data) => {
  const { shelter_id, contact_name, contact_phone } = data;
  const errors = [];
  if (!shelter_id) errors.push('shelter_id is required');
  if (!contact_name || !String(contact_name).trim()) errors.push('contact_name is required');
  if (!contact_phone || !String(contact_phone).trim()) errors.push('contact_phone is required');
  return errors;
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch emergency contacts', error: error.message });
  }
};

const getByShelter = async (req, res) => {
  try {
    const contacts = await contactModel.getContactsByShelter(req.params.shelterId);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const contact = await contactModel.getContactById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const errors = validateContactInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const contactId = await contactModel.createContact(req.body);
    const contact = await contactModel.getContactById(contactId);
    res.status(201).json({ message: 'Emergency contact created successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await contactModel.getContactById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Contact not found' });

    const errors = validateContactInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await contactModel.updateContact(req.params.id, req.body);
    const contact = await contactModel.getContactById(req.params.id);
    res.status(200).json({ message: 'Emergency contact updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await contactModel.getContactById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Contact not found' });

    await contactModel.deleteContact(req.params.id);
    res.status(200).json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
};

module.exports = { getAllContacts, getByShelter, getById, create, update, remove };
