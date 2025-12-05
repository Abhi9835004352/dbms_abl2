const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all vehicles with owner info
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, c.Name as Owner_Name
      FROM Vehicles v
      LEFT JOIN Citizens c ON v.Citizen_ID = c.Citizen_ID
      ORDER BY v.Vehicle_ID DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single vehicle with fines
router.get('/:id', async (req, res) => {
  try {
    const [vehicle] = await db.query(`
      SELECT v.*, c.Name as Owner_Name
      FROM Vehicles v
      LEFT JOIN Citizens c ON v.Citizen_ID = c.Citizen_ID
      WHERE v.Vehicle_ID = ?
    `, [req.params.id]);
    
    if (vehicle.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    const [fines] = await db.query('SELECT * FROM Fines WHERE Vehicle_ID = ?', [req.params.id]);
    
    res.json({ ...vehicle[0], fines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create vehicle
router.post('/', async (req, res) => {
  try {
    const { Registration_Number, Vehicle_Type, Model, Registration_Date, Citizen_ID } = req.body;
    const [result] = await db.query(
      'INSERT INTO Vehicles (Registration_Number, Vehicle_Type, Model, Registration_Date, Citizen_ID) VALUES (?, ?, ?, ?, ?)',
      [Registration_Number, Vehicle_Type, Model, Registration_Date, Citizen_ID]
    );
    res.status(201).json({ 
      message: 'Vehicle created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update vehicle
router.put('/:id', async (req, res) => {
  try {
    const { Registration_Number, Vehicle_Type, Model, Registration_Date, Citizen_ID } = req.body;
    const [result] = await db.query(
      'UPDATE Vehicles SET Registration_Number = ?, Vehicle_Type = ?, Model = ?, Registration_Date = ?, Citizen_ID = ? WHERE Vehicle_ID = ?',
      [Registration_Number, Vehicle_Type, Model, Registration_Date, Citizen_ID, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Vehicles WHERE Vehicle_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
