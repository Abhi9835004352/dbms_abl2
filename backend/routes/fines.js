const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all fines with vehicle and employee info
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, v.Registration_Number, e.Name as Issued_By_Name
      FROM Fines f
      LEFT JOIN Vehicles v ON f.Vehicle_ID = v.Vehicle_ID
      LEFT JOIN Employees e ON f.Issued_By = e.Emp_ID
      ORDER BY f.Fine_ID DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single fine
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, v.Registration_Number, e.Name as Issued_By_Name
      FROM Fines f
      LEFT JOIN Vehicles v ON f.Vehicle_ID = v.Vehicle_ID
      LEFT JOIN Employees e ON f.Issued_By = e.Emp_ID
      WHERE f.Fine_ID = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create fine
router.post('/', async (req, res) => {
  try {
    const { Fine_Date, Amount, Reason, Status, Vehicle_ID, Issued_By } = req.body;
    const [result] = await db.query(
      'INSERT INTO Fines (Fine_Date, Amount, Reason, Status, Vehicle_ID, Issued_By) VALUES (?, ?, ?, ?, ?, ?)',
      [Fine_Date, Amount, Reason, Status, Vehicle_ID, Issued_By]
    );
    res.status(201).json({ 
      message: 'Fine created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update fine
router.put('/:id', async (req, res) => {
  try {
    const { Fine_Date, Amount, Reason, Status, Vehicle_ID, Issued_By } = req.body;
    const [result] = await db.query(
      'UPDATE Fines SET Fine_Date = ?, Amount = ?, Reason = ?, Status = ?, Vehicle_ID = ?, Issued_By = ? WHERE Fine_ID = ?',
      [Fine_Date, Amount, Reason, Status, Vehicle_ID, Issued_By, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }
    res.json({ message: 'Fine updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE fine
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Fines WHERE Fine_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }
    res.json({ message: 'Fine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET unpaid fines
router.get('/status/unpaid', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, v.Registration_Number, c.Name as Owner_Name
      FROM Fines f
      JOIN Vehicles v ON f.Vehicle_ID = v.Vehicle_ID
      JOIN Citizens c ON v.Citizen_ID = c.Citizen_ID
      WHERE f.Status = 'Unpaid'
      ORDER BY f.Fine_Date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
