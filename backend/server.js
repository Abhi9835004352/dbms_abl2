const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const citizensRouter = require('./routes/citizens');
const departmentsRouter = require('./routes/departments');
const employeesRouter = require('./routes/employees');
const servicesRouter = require('./routes/services');
const propertiesRouter = require('./routes/properties');
const vehiclesRouter = require('./routes/vehicles');
const finesRouter = require('./routes/fines');
const eventsRouter = require('./routes/events');
const queryRouter = require('./routes/query');

// Use Routes
    app.use('/api/citizens', citizensRouter);
    app.use('/api/departments', departmentsRouter);
    app.use('/api/employees', employeesRouter);
    app.use('/api/services', servicesRouter);
    app.use('/api/properties', propertiesRouter);
    app.use('/api/vehicles', vehiclesRouter);
    app.use('/api/fines', finesRouter);
    app.use('/api/events', eventsRouter);
    app.use('/api/query', queryRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🏙️ Smart City Management System API',
    version: '1.0.0',
    endpoints: [
      '/api/citizens',
      '/api/departments',
      '/api/employees',
      '/api/services',
      '/api/properties',
      '/api/vehicles',
      '/api/fines',
      '/api/events',
      '/api/query'
    ]
  });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  const db = require('./config/db');
  try {
    const [citizens] = await db.query('SELECT COUNT(*) as count FROM Citizens');
    const [departments] = await db.query('SELECT COUNT(*) as count FROM Departments');
    const [employees] = await db.query('SELECT COUNT(*) as count FROM Employees');
    const [services] = await db.query('SELECT COUNT(*) as count FROM City_Services');
    const [properties] = await db.query('SELECT COUNT(*) as count FROM Properties');
    const [vehicles] = await db.query('SELECT COUNT(*) as count FROM Vehicles');
    const [fines] = await db.query('SELECT COUNT(*) as count FROM Fines');
    const [events] = await db.query('SELECT COUNT(*) as count FROM City_Events');
    
    res.json({
      citizens: citizens[0].count,
      departments: departments[0].count,
      employees: employees[0].count,
      services: services[0].count,
      properties: properties[0].count,
      vehicles: vehicles[0].count,
      fines: fines[0].count,
      events: events[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
