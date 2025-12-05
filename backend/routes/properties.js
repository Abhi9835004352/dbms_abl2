const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all properties with ownership info
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Properties ORDER BY Property_ID DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single property with owners
router.get('/:id', async (req, res) => {
  try {
    const [property] = await db.query('SELECT * FROM Properties WHERE Property_ID = ?', [req.params.id]);
    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const [owners] = await db.query(`
      SELECT c.*, po.Ownership_Date, po.Share_Percentage
      FROM Property_Ownership po
      JOIN Citizens c ON po.Citizen_ID = c.Citizen_ID
      WHERE po.Property_ID = ?
    `, [req.params.id]);
    
    res.json({ ...property[0], owners });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create property
router.post('/', async (req, res) => {
  try {
    const { Address, Property_Type, Area_SqFt, Annual_Tax } = req.body;
    const [result] = await db.query(
      'INSERT INTO Properties (Address, Property_Type, Area_SqFt, Annual_Tax) VALUES (?, ?, ?, ?)',
      [Address, Property_Type, Area_SqFt, Annual_Tax]
    );
    res.status(201).json({ 
      message: 'Property created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update property
router.put('/:id', async (req, res) => {
  try {
    const { Address, Property_Type, Area_SqFt, Annual_Tax } = req.body;
    const [result] = await db.query(
      'UPDATE Properties SET Address = ?, Property_Type = ?, Area_SqFt = ?, Annual_Tax = ? WHERE Property_ID = ?',
      [Address, Property_Type, Area_SqFt, Annual_Tax, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE property
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Properties WHERE Property_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add property ownership
router.post('/:id/ownership', async (req, res) => {
  try {
    const { Citizen_ID, Ownership_Date, Share_Percentage } = req.body;
    await db.query(
      'INSERT INTO Property_Ownership (Property_ID, Citizen_ID, Ownership_Date, Share_Percentage) VALUES (?, ?, ?, ?)',
      [req.params.id, Citizen_ID, Ownership_Date, Share_Percentage]
    );
    res.status(201).json({ message: 'Ownership added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
