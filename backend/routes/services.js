const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all services with department info
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.Dept_Name
      FROM City_Services s
      LEFT JOIN Departments d ON s.Dept_ID = d.Dept_ID
      ORDER BY s.Service_ID DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.Dept_Name
      FROM City_Services s
      LEFT JOIN Departments d ON s.Dept_ID = d.Dept_ID
      WHERE s.Service_ID = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create service
router.post('/', async (req, res) => {
  try {
    const { Service_Name, Service_Type, Availability_Status, Dept_ID } = req.body;
    const [result] = await db.query(
      'INSERT INTO City_Services (Service_Name, Service_Type, Availability_Status, Dept_ID) VALUES (?, ?, ?, ?)',
      [Service_Name, Service_Type, Availability_Status, Dept_ID]
    );
    res.status(201).json({ 
      message: 'Service created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update service
router.put('/:id', async (req, res) => {
  try {
    const { Service_Name, Service_Type, Availability_Status, Dept_ID } = req.body;
    const [result] = await db.query(
      'UPDATE City_Services SET Service_Name = ?, Service_Type = ?, Availability_Status = ?, Dept_ID = ? WHERE Service_ID = ?',
      [Service_Name, Service_Type, Availability_Status, Dept_ID, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM City_Services WHERE Service_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET service applications
router.get('/:id/applications', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sa.*, c.Name as Citizen_Name
      FROM Service_Applications sa
      JOIN Citizens c ON sa.Citizen_ID = c.Citizen_ID
      WHERE sa.Service_ID = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
