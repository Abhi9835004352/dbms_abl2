const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all employees with department info
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.Dept_Name, s.Name as Supervisor_Name
      FROM Employees e
      LEFT JOIN Departments d ON e.Dept_ID = d.Dept_ID
      LEFT JOIN Employees s ON e.Supervisor_ID = s.Emp_ID
      ORDER BY e.Emp_ID DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single employee
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.Dept_Name, s.Name as Supervisor_Name
      FROM Employees e
      LEFT JOIN Departments d ON e.Dept_ID = d.Dept_ID
      LEFT JOIN Employees s ON e.Supervisor_ID = s.Emp_ID
      WHERE e.Emp_ID = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create employee
router.post('/', async (req, res) => {
  try {
    const { Name, Designation, Salary, Joining_Date, Contact_Number, Dept_ID, Supervisor_ID } = req.body;
    const [result] = await db.query(
      'INSERT INTO Employees (Name, Designation, Salary, Joining_Date, Contact_Number, Dept_ID, Supervisor_ID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Name, Designation, Salary, Joining_Date, Contact_Number, Dept_ID, Supervisor_ID || null]
    );
    res.status(201).json({ 
      message: 'Employee created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const { Name, Designation, Salary, Joining_Date, Contact_Number, Dept_ID, Supervisor_ID } = req.body;
    const [result] = await db.query(
      'UPDATE Employees SET Name = ?, Designation = ?, Salary = ?, Joining_Date = ?, Contact_Number = ?, Dept_ID = ?, Supervisor_ID = ? WHERE Emp_ID = ?',
      [Name, Designation, Salary, Joining_Date, Contact_Number, Dept_ID, Supervisor_ID || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Employees WHERE Emp_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
