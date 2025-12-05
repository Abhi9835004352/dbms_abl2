const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all events with department info
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.Dept_Name
      FROM City_Events e
      LEFT JOIN Departments d ON e.Dept_ID = d.Dept_ID
      ORDER BY e.Event_Date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single event with registrations
router.get('/:id', async (req, res) => {
  try {
    const [event] = await db.query(`
      SELECT e.*, d.Dept_Name
      FROM City_Events e
      LEFT JOIN Departments d ON e.Dept_ID = d.Dept_ID
      WHERE e.Event_ID = ?
    `, [req.params.id]);
    
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const [registrations] = await db.query(`
      SELECT er.*, c.Name as Citizen_Name
      FROM Event_Registrations er
      JOIN Citizens c ON er.Citizen_ID = c.Citizen_ID
      WHERE er.Event_ID = ?
    `, [req.params.id]);
    
    res.json({ ...event[0], registrations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const { Event_Name, Event_Type, Event_Date, Location, Dept_ID } = req.body;
    const [result] = await db.query(
      'INSERT INTO City_Events (Event_Name, Event_Type, Event_Date, Location, Dept_ID) VALUES (?, ?, ?, ?, ?)',
      [Event_Name, Event_Type, Event_Date, Location, Dept_ID]
    );
    res.status(201).json({ 
      message: 'Event created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const { Event_Name, Event_Type, Event_Date, Location, Dept_ID } = req.body;
    const [result] = await db.query(
      'UPDATE City_Events SET Event_Name = ?, Event_Type = ?, Event_Date = ?, Location = ?, Dept_ID = ? WHERE Event_ID = ?',
      [Event_Name, Event_Type, Event_Date, Location, Dept_ID, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM City_Events WHERE Event_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST register for event
router.post('/:id/register', async (req, res) => {
  try {
    const { Citizen_ID, Registration_Date, Participation_Status } = req.body;
    await db.query(
      'INSERT INTO Event_Registrations (Event_ID, Citizen_ID, Registration_Date, Participation_Status) VALUES (?, ?, ?, ?)',
      [req.params.id, Citizen_ID, Registration_Date, Participation_Status || 'Registered']
    );
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET upcoming events
router.get('/status/upcoming', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.Dept_Name
      FROM City_Events e
      LEFT JOIN Departments d ON e.Dept_ID = d.Dept_ID
      WHERE e.Event_Date >= CURDATE()
      ORDER BY e.Event_Date ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
