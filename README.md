# 🏙️ Smart City Management System

A full-stack web application for managing city data including citizens, departments, employees, services, properties, vehicles, fines, and events.

## 📁 Project Structure

```
dbms_open_ended/
├── backend/                 # Node.js + Express API
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── routes/
│   │   ├── citizens.js     # Citizens CRUD
│   │   ├── departments.js  # Departments CRUD
│   │   ├── employees.js    # Employees CRUD
│   │   ├── services.js     # Services CRUD
│   │   ├── properties.js   # Properties CRUD
│   │   ├── vehicles.js     # Vehicles CRUD
│   │   ├── fines.js        # Fines CRUD
│   │   ├── events.js       # Events CRUD
│   │   └── query.js        # Custom SQL queries
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Main server file
├── frontend/               # React.js UI
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   └── App.css        # Styles
│   └── package.json
├── database/
│   └── smart_city_schema.sql  # Database schema & sample data
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Step 1: Setup Database

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the schema file:
```sql
source /path/to/dbms_open_ended/database/smart_city_schema.sql
```

Or copy-paste the SQL file contents into MySQL Workbench.

### Step 2: Configure Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Update `.env` file with your MySQL password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=SmartCityDB
PORT=5000
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

Server will run at: http://localhost:5000

### Step 3: Start Frontend

1. Open a new terminal window

2. Navigate to frontend folder:
```bash
cd frontend
```

3. Install dependencies (already done, but if needed):
```bash
npm install
```

4. Start React app:
```bash
npm start
```

App will open at: http://localhost:3000

## ✨ Features

### Dashboard
- Overview statistics for all entities
- Visual cards showing counts

### Entity Management (CRUD)
- **Citizens**: Add, view, edit, delete citizens
- **Departments**: Manage city departments
- **Employees**: Employee records with supervisor relationships
- **Services**: City services with department mapping
- **Properties**: Property registry with ownership
- **Vehicles**: Vehicle registration linked to citizens
- **Fines**: Traffic fines with vehicle and employee links
- **Events**: City events organized by departments

### SQL Query Interface
- Execute custom SELECT, INSERT, UPDATE, DELETE queries
- View results in formatted tables
- See affected rows for DML operations

## 🔗 API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/citizens` | GET, POST | List/Create citizens |
| `/api/citizens/:id` | GET, PUT, DELETE | Get/Update/Delete citizen |
| `/api/departments` | GET, POST | List/Create departments |
| `/api/employees` | GET, POST | List/Create employees |
| `/api/services` | GET, POST | List/Create services |
| `/api/properties` | GET, POST | List/Create properties |
| `/api/vehicles` | GET, POST | List/Create vehicles |
| `/api/fines` | GET, POST | List/Create fines |
| `/api/events` | GET, POST | List/Create events |
| `/api/query/execute` | POST | Execute custom SQL |
| `/api/stats` | GET | Get all entity counts |

## 🛠️ Technologies Used

- **Frontend**: React.js, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Tools**: npm, nodemon

## 📝 Database Schema

### Core Tables
1. **Citizens** - Citizen information
2. **Departments** - City departments
3. **Employees** - Government employees
4. **City_Services** - Services offered
5. **Properties** - Property registry
6. **Vehicles** - Vehicle registration
7. **Fines** - Traffic violations
8. **City_Events** - City events

### Relationship Tables (M:N)
1. **Property_Ownership** - Citizens owning properties
2. **Service_Applications** - Citizens applying for services
3. **Event_Registrations** - Citizens registering for events
4. **Service_Handlers** - Employees managing services
5. **Event_Management** - Employees organizing events

## 🔒 Security Features

- Input validation on forms
- SQL query restrictions (blocks DROP, TRUNCATE, ALTER)
- Parameterized queries to prevent SQL injection
- CORS enabled for API access

## 📞 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify `.env` file has correct database credentials
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API_BASE URL in App.js

### Database errors
- Run the schema file again to reset
- Check table names match (case-sensitive)

## 👤 Author

DBMS Open Ended Project - Smart City Management System

---

**Happy Coding! 🚀**
# dbms_abl2
