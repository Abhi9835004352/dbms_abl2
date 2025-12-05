const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Execute custom SQL query (DML operations)
router.post('/execute', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }
    
    // Basic security check - only allow SELECT, INSERT, UPDATE, DELETE
    const queryUpper = query.trim().toUpperCase();
    const allowedOperations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
    const startsWithAllowed = allowedOperations.some(op => queryUpper.startsWith(op));
    
    // Block dangerous operations
    const blockedKeywords = ['DROP', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];
    const containsBlocked = blockedKeywords.some(keyword => queryUpper.includes(keyword));
    
    if (!startsWithAllowed || containsBlocked) {
      return res.status(403).json({ 
        error: 'Only SELECT, INSERT, UPDATE, and DELETE operations are allowed' 
      });
    }
    
    const [result] = await db.query(query);
    
    // Determine the type of operation
    if (queryUpper.startsWith('SELECT')) {
      res.json({
        type: 'SELECT',
        rowCount: result.length,
        data: result
      });
    } else if (queryUpper.startsWith('INSERT')) {
      res.json({
        type: 'INSERT',
        message: 'Insert successful',
        affectedRows: result.affectedRows,
        insertId: result.insertId
      });
    } else if (queryUpper.startsWith('UPDATE')) {
      res.json({
        type: 'UPDATE',
        message: 'Update successful',
        affectedRows: result.affectedRows,
        changedRows: result.changedRows
      });
    } else if (queryUpper.startsWith('DELETE')) {
      res.json({
        type: 'DELETE',
        message: 'Delete successful',
        affectedRows: result.affectedRows
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all table names
router.get('/tables', async (req, res) => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    const tables = rows.map(row => Object.values(row)[0]);
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table structure
router.get('/describe/:table', async (req, res) => {
  try {
    const tableName = req.params.table;
    // Validate table name to prevent SQL injection
    const validTables = [
      'Citizens', 'Departments', 'Employees', 'City_Services', 
      'Properties', 'Vehicles', 'Fines', 'City_Events',
      'Property_Ownership', 'Service_Applications', 'Event_Registrations',
      'Service_Handlers', 'Event_Management'
    ];
    
    if (!validTables.includes(tableName)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }
    
    const [rows] = await db.query(`DESCRIBE ${tableName}`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
