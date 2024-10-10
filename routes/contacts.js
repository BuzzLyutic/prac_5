const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Create a new contact
router.post('/', async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one contact
router.get('/:id', getContact, (req, res) => {
  res.json(res.contact);
});

// Update a contact
router.put('/:id', getContact, async (req, res) => {
  if (req.body.name != null) {
    res.contact.name = req.body.name;
  }
  if (req.body.phone != null) {
    res.contact.phone = req.body.phone;
  }
  if (req.body.email != null) {
    res.contact.email = req.body.email;
  }
  if (req.body.address != null) {
    res.contact.address = req.body.address;
  }

  try {
    const updatedContact = await res.contact.save();
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a contact
router.delete('/:id', getContact, async (req, res) => {
  try {
    await res.contact.remove();
    res.json({ message: 'Deleted Contact' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get contact by ID
async function getContact(req, res, next) {
  let contact;
  try {
    contact = await Contact.findById(req.params.id);
    if (contact == null) {
      return res.status(404).json({ message: 'Cannot find contact' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.contact = contact;
  next();
}

module.exports = router;