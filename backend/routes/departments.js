const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all departments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Departments ORDER BY Dept_ID DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single department
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Departments WHERE Dept_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create department
router.post('/', async (req, res) => {
  try {
    const { Dept_Name, Dept_Type, Office_Location } = req.body;
    const [result] = await db.query(
      'INSERT INTO Departments (Dept_Name, Dept_Type, Office_Location) VALUES (?, ?, ?)',
      [Dept_Name, Dept_Type, Office_Location]
    );
    res.status(201).json({ 
      message: 'Department created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update department
router.put('/:id', async (req, res) => {
  try {
    const { Dept_Name, Dept_Type, Office_Location } = req.body;
    const [result] = await db.query(
      'UPDATE Departments SET Dept_Name = ?, Dept_Type = ?, Office_Location = ? WHERE Dept_ID = ?',
      [Dept_Name, Dept_Type, Office_Location, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE department
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Departments WHERE Dept_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
