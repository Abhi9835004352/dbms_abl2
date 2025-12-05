const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all citizens
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Citizens ORDER BY Citizen_ID DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single citizen
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Citizens WHERE Citizen_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create citizen
router.post('/', async (req, res) => {
  try {
    const { Name, Date_of_Birth, Gender, Address, Phone, Email } = req.body;
    const [result] = await db.query(
      'INSERT INTO Citizens (Name, Date_of_Birth, Gender, Address, Phone, Email) VALUES (?, ?, ?, ?, ?, ?)',
      [Name, Date_of_Birth, Gender, Address, Phone, Email]
    );
    res.status(201).json({ 
      message: 'Citizen created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update citizen
router.put('/:id', async (req, res) => {
  try {
    const { Name, Date_of_Birth, Gender, Address, Phone, Email } = req.body;
    const [result] = await db.query(
      'UPDATE Citizens SET Name = ?, Date_of_Birth = ?, Gender = ?, Address = ?, Phone = ?, Email = ? WHERE Citizen_ID = ?',
      [Name, Date_of_Birth, Gender, Address, Phone, Email, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }
    res.json({ message: 'Citizen updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE citizen
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Citizens WHERE Citizen_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }
    res.json({ message: 'Citizen deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
