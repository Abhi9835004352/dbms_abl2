-- =====================================================
-- SMART CITY MANAGEMENT SYSTEM - DATABASE IMPLEMENTATION
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS SmartCityDB;
USE SmartCityDB;

-- =====================================================
-- DROP EXISTING TABLES (for clean installation)
-- =====================================================
DROP TABLE IF EXISTS Event_Management;
DROP TABLE IF EXISTS Service_Handlers;
DROP TABLE IF EXISTS Event_Registrations;
DROP TABLE IF EXISTS Service_Applications;
DROP TABLE IF EXISTS Property_Ownership;
DROP TABLE IF EXISTS Fines;
DROP TABLE IF EXISTS Vehicles;
DROP TABLE IF EXISTS Properties;
DROP TABLE IF EXISTS City_Events;
DROP TABLE IF EXISTS City_Services;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Citizens;

-- =====================================================
-- 1. CITIZENS TABLE
-- =====================================================
CREATE TABLE Citizens (
    Citizen_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Date_of_Birth DATE NOT NULL,
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Phone VARCHAR(15) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE Departments (
    Dept_ID INT PRIMARY KEY AUTO_INCREMENT,
    Dept_Name VARCHAR(100) NOT NULL UNIQUE,
    Dept_Type ENUM('Health', 'Transport', 'Education', 'Municipal', 'Finance', 'Environment') NOT NULL,
    Office_Location VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. EMPLOYEES TABLE (with self-referencing for Supervisor)
-- =====================================================
CREATE TABLE Employees (
    Emp_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Designation VARCHAR(100) NOT NULL,
    Salary DECIMAL(12, 2) NOT NULL CHECK (Salary > 0),
    Joining_Date DATE NOT NULL,
    Contact_Number VARCHAR(15) NOT NULL UNIQUE,
    Dept_ID INT NOT NULL,
    Supervisor_ID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Dept_ID) REFERENCES Departments(Dept_ID) ON DELETE RESTRICT,
    FOREIGN KEY (Supervisor_ID) REFERENCES Employees(Emp_ID) ON DELETE SET NULL
);

-- =====================================================
-- 4. CITY SERVICES TABLE
-- =====================================================
CREATE TABLE City_Services (
    Service_ID INT PRIMARY KEY AUTO_INCREMENT,
    Service_Name VARCHAR(100) NOT NULL,
    Service_Type ENUM('Water', 'Electricity', 'Sanitation', 'Transport', 'Healthcare') NOT NULL,
    Availability_Status ENUM('Available', 'Unavailable', 'Limited') DEFAULT 'Available',
    Dept_ID INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Dept_ID) REFERENCES Departments(Dept_ID) ON DELETE RESTRICT
);

-- =====================================================
-- 5. PROPERTIES TABLE
-- =====================================================
CREATE TABLE Properties (
    Property_ID INT PRIMARY KEY AUTO_INCREMENT,
    Address VARCHAR(255) NOT NULL,
    Property_Type ENUM('Residential', 'Commercial') NOT NULL,
    Area_SqFt DECIMAL(10, 2) NOT NULL CHECK (Area_SqFt > 0),
    Annual_Tax DECIMAL(12, 2) NOT NULL CHECK (Annual_Tax >= 0),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. VEHICLES TABLE
-- =====================================================
CREATE TABLE Vehicles (
    Vehicle_ID INT PRIMARY KEY AUTO_INCREMENT,
    Registration_Number VARCHAR(20) NOT NULL UNIQUE,
    Vehicle_Type ENUM('Car', 'Bike', 'Bus', 'Truck', 'Auto') NOT NULL,
    Model VARCHAR(100) NOT NULL,
    Registration_Date DATE NOT NULL,
    Citizen_ID INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Citizen_ID) REFERENCES Citizens(Citizen_ID) ON DELETE CASCADE
);

-- =====================================================
-- 7. FINES TABLE
-- =====================================================
CREATE TABLE Fines (
    Fine_ID INT PRIMARY KEY AUTO_INCREMENT,
    Fine_Date DATE NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL CHECK (Amount > 0),
    Reason VARCHAR(255) NOT NULL,
    Status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    Vehicle_ID INT NOT NULL,
    Issued_By INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Vehicle_ID) REFERENCES Vehicles(Vehicle_ID) ON DELETE CASCADE,
    FOREIGN KEY (Issued_By) REFERENCES Employees(Emp_ID) ON DELETE RESTRICT
);

-- =====================================================
-- 8. CITY EVENTS TABLE
-- =====================================================
CREATE TABLE City_Events (
    Event_ID INT PRIMARY KEY AUTO_INCREMENT,
    Event_Name VARCHAR(100) NOT NULL,
    Event_Type ENUM('Cultural', 'Sports', 'Educational', 'Health', 'Government') NOT NULL,
    Event_Date DATE NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Dept_ID INT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Dept_ID) REFERENCES Departments(Dept_ID) ON DELETE RESTRICT
);

-- =====================================================
-- RELATIONSHIP TABLES (M:N Relationships)
-- =====================================================

-- Property Ownership (Citizen - Property: M:N)
CREATE TABLE Property_Ownership (
    Ownership_ID INT PRIMARY KEY AUTO_INCREMENT,
    Property_ID INT NOT NULL,
    Citizen_ID INT NOT NULL,
    Ownership_Date DATE NOT NULL,
    Share_Percentage DECIMAL(5, 2) NOT NULL CHECK (Share_Percentage > 0 AND Share_Percentage <= 100),
    FOREIGN KEY (Property_ID) REFERENCES Properties(Property_ID) ON DELETE CASCADE,
    FOREIGN KEY (Citizen_ID) REFERENCES Citizens(Citizen_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_ownership (Property_ID, Citizen_ID)
);

-- Service Applications (Citizen - Service: M:N)
CREATE TABLE Service_Applications (
    Application_ID INT PRIMARY KEY AUTO_INCREMENT,
    Citizen_ID INT NOT NULL,
    Service_ID INT NOT NULL,
    Application_Date DATE NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    Fees_Paid DECIMAL(10, 2) DEFAULT 0 CHECK (Fees_Paid >= 0),
    FOREIGN KEY (Citizen_ID) REFERENCES Citizens(Citizen_ID) ON DELETE CASCADE,
    FOREIGN KEY (Service_ID) REFERENCES City_Services(Service_ID) ON DELETE CASCADE
);

-- Event Registrations (Citizen - Event: M:N)
CREATE TABLE Event_Registrations (
    Registration_ID INT PRIMARY KEY AUTO_INCREMENT,
    Event_ID INT NOT NULL,
    Citizen_ID INT NOT NULL,
    Registration_Date DATE NOT NULL,
    Participation_Status ENUM('Registered', 'Attended', 'Cancelled') DEFAULT 'Registered',
    FOREIGN KEY (Event_ID) REFERENCES City_Events(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Citizen_ID) REFERENCES Citizens(Citizen_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (Event_ID, Citizen_ID)
);

-- Service Handlers (Employee - Service: M:N)
CREATE TABLE Service_Handlers (
    Handler_ID INT PRIMARY KEY AUTO_INCREMENT,
    Service_ID INT NOT NULL,
    Emp_ID INT NOT NULL,
    Assigned_Date DATE NOT NULL,
    Role VARCHAR(100),
    FOREIGN KEY (Service_ID) REFERENCES City_Services(Service_ID) ON DELETE CASCADE,
    FOREIGN KEY (Emp_ID) REFERENCES Employees(Emp_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_handler (Service_ID, Emp_ID)
);

-- Event Management (Employee - Event: M:N)
CREATE TABLE Event_Management (
    Management_ID INT PRIMARY KEY AUTO_INCREMENT,
    Event_ID INT NOT NULL,
    Emp_ID INT NOT NULL,
    Role VARCHAR(100) NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES City_Events(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Emp_ID) REFERENCES Employees(Emp_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_event_emp (Event_ID, Emp_ID)
);

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX idx_citizen_name ON Citizens(Name);
CREATE INDEX idx_employee_dept ON Employees(Dept_ID);
CREATE INDEX idx_vehicle_citizen ON Vehicles(Citizen_ID);
CREATE INDEX idx_fine_status ON Fines(Status);
CREATE INDEX idx_event_date ON City_Events(Event_Date);
CREATE INDEX idx_service_status ON City_Services(Availability_Status);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert Departments
INSERT INTO Departments (Dept_Name, Dept_Type, Office_Location) VALUES
('Health Department', 'Health', 'City Hall, Block A'),
('Transport Authority', 'Transport', 'Transport Bhawan, Sector 5'),
('Education Board', 'Education', 'Education Complex, Main Road'),
('Municipal Corporation', 'Municipal', 'City Center, MG Road'),
('Finance Department', 'Finance', 'Treasury Building, Block C'),
('Environment Agency', 'Environment', 'Green Building, Eco Park');

-- Insert Citizens
INSERT INTO Citizens (Name, Date_of_Birth, Gender, Address, Phone, Email) VALUES
('Rajesh Kumar', '1985-03-15', 'Male', '123 MG Road, Sector 4', '9876543210', 'rajesh@email.com'),
('Priya Sharma', '1990-07-22', 'Female', '456 Park Street, Block B', '9876543211', 'priya@email.com'),
('Amit Singh', '1988-12-01', 'Male', '789 Gandhi Nagar, Phase 2', '9876543212', 'amit@email.com'),
('Sneha Patel', '1992-05-10', 'Female', '321 Nehru Colony, Sector 7', '9876543213', 'sneha@email.com'),
('Vikram Reddy', '1980-09-25', 'Male', '654 Lake View Apartments', '9876543214', 'vikram@email.com');

-- Insert Employees
INSERT INTO Employees (Name, Designation, Salary, Joining_Date, Contact_Number, Dept_ID, Supervisor_ID) VALUES
('Dr. Anil Mehta', 'Director', 150000.00, '2010-01-01', '9800000001', 1, NULL),
('Suresh Rao', 'Transport Officer', 75000.00, '2015-06-15', '9800000002', 2, NULL),
('Kavita Joshi', 'Education Coordinator', 65000.00, '2018-03-20', '9800000003', 3, NULL),
('Ramesh Gupta', 'Municipal Engineer', 80000.00, '2012-09-10', '9800000004', 4, NULL),
('Neha Verma', 'Finance Analyst', 70000.00, '2019-11-25', '9800000005', 5, NULL),
('Sanjay Kumar', 'Environmental Officer', 72000.00, '2017-04-08', '9800000006', 6, NULL),
('Pooja Singh', 'Assistant Officer', 45000.00, '2020-02-14', '9800000007', 2, 2),
('Arjun Nair', 'Junior Engineer', 50000.00, '2021-07-01', '9800000008', 4, 4);

-- Insert City Services
INSERT INTO City_Services (Service_Name, Service_Type, Availability_Status, Dept_ID) VALUES
('Water Supply Connection', 'Water', 'Available', 4),
('Electricity Connection', 'Electricity', 'Available', 4),
('Garbage Collection', 'Sanitation', 'Available', 4),
('Public Bus Service', 'Transport', 'Available', 2),
('City Hospital Services', 'Healthcare', 'Available', 1);

-- Insert Properties
INSERT INTO Properties (Address, Property_Type, Area_SqFt, Annual_Tax) VALUES
('Plot 101, Sector 4', 'Residential', 1500.00, 25000.00),
('Shop 25, Commercial Complex', 'Commercial', 800.00, 45000.00),
('Flat 302, Green Valley Apartments', 'Residential', 1200.00, 18000.00),
('Office Space, Tech Park', 'Commercial', 2500.00, 75000.00),
('Villa 12, Palm Gardens', 'Residential', 3000.00, 50000.00);

-- Insert Vehicles
INSERT INTO Vehicles (Registration_Number, Vehicle_Type, Model, Registration_Date, Citizen_ID) VALUES
('MH01AB1234', 'Car', 'Honda City', '2020-05-15', 1),
('MH01CD5678', 'Bike', 'Royal Enfield', '2019-08-20', 2),
('MH01EF9012', 'Car', 'Maruti Swift', '2021-01-10', 3),
('MH01GH3456', 'Bus', 'Tata Starbus', '2018-03-25', 4),
('MH01IJ7890', 'Auto', 'Bajaj RE', '2022-06-30', 5);

-- Insert Fines
INSERT INTO Fines (Fine_Date, Amount, Reason, Status, Vehicle_ID, Issued_By) VALUES
('2024-01-15', 500.00, 'Parking Violation', 'Paid', 1, 2),
('2024-02-20', 1000.00, 'Signal Jump', 'Unpaid', 2, 2),
('2024-03-10', 2000.00, 'Overspeeding', 'Unpaid', 3, 7),
('2024-04-05', 500.00, 'No Helmet', 'Paid', 2, 7);

-- Insert City Events
INSERT INTO City_Events (Event_Name, Event_Type, Event_Date, Location, Dept_ID) VALUES
('Annual Health Camp', 'Health', '2024-06-15', 'City Stadium', 1),
('Road Safety Week', 'Educational', '2024-07-01', 'Town Hall', 2),
('Science Exhibition', 'Educational', '2024-08-20', 'Education Complex', 3),
('City Marathon', 'Sports', '2024-09-10', 'City Park', 4),
('Tree Plantation Drive', 'Government', '2024-10-05', 'Central Park', 6);

-- Insert Property Ownership
INSERT INTO Property_Ownership (Property_ID, Citizen_ID, Ownership_Date, Share_Percentage) VALUES
(1, 1, '2018-05-15', 100.00),
(2, 2, '2019-08-20', 100.00),
(3, 3, '2020-01-10', 50.00),
(3, 4, '2020-01-10', 50.00),
(4, 5, '2017-03-25', 100.00),
(5, 1, '2021-06-30', 60.00),
(5, 3, '2021-06-30', 40.00);

-- Insert Service Applications
INSERT INTO Service_Applications (Citizen_ID, Service_ID, Application_Date, Status, Fees_Paid) VALUES
(1, 1, '2024-01-10', 'Approved', 500.00),
(2, 2, '2024-02-15', 'Pending', 0.00),
(3, 3, '2024-03-20', 'Completed', 200.00),
(4, 4, '2024-04-25', 'Approved', 100.00),
(5, 5, '2024-05-30', 'Pending', 0.00);

-- Insert Event Registrations
INSERT INTO Event_Registrations (Event_ID, Citizen_ID, Registration_Date, Participation_Status) VALUES
(1, 1, '2024-06-01', 'Registered'),
(1, 2, '2024-06-02', 'Registered'),
(2, 3, '2024-06-15', 'Registered'),
(4, 4, '2024-09-01', 'Registered'),
(5, 5, '2024-09-25', 'Registered');

-- Insert Service Handlers
INSERT INTO Service_Handlers (Service_ID, Emp_ID, Assigned_Date, Role) VALUES
(1, 4, '2023-01-01', 'Primary Handler'),
(2, 4, '2023-01-01', 'Primary Handler'),
(3, 8, '2023-06-15', 'Assistant'),
(4, 2, '2023-01-01', 'Primary Handler'),
(5, 1, '2023-01-01', 'Medical Supervisor');

-- Insert Event Management
INSERT INTO Event_Management (Event_ID, Emp_ID, Role) VALUES
(1, 1, 'Event Coordinator'),
(2, 2, 'Event Organizer'),
(3, 3, 'Event Manager'),
(4, 4, 'Event Coordinator'),
(5, 6, 'Event Organizer');

-- =====================================================
-- USEFUL QUERIES (for testing)
-- =====================================================

-- View all citizens with their vehicles
-- SELECT c.Name, v.Registration_Number, v.Vehicle_Type, v.Model
-- FROM Citizens c
-- LEFT JOIN Vehicles v ON c.Citizen_ID = v.Citizen_ID;

-- View all unpaid fines
-- SELECT f.*, v.Registration_Number, c.Name as Owner_Name
-- FROM Fines f
-- JOIN Vehicles v ON f.Vehicle_ID = v.Vehicle_ID
-- JOIN Citizens c ON v.Citizen_ID = c.Citizen_ID
-- WHERE f.Status = 'Unpaid';

-- View pending service applications
-- SELECT sa.*, c.Name as Citizen_Name, cs.Service_Name
-- FROM Service_Applications sa
-- JOIN Citizens c ON sa.Citizen_ID = c.Citizen_ID
-- JOIN City_Services cs ON sa.Service_ID = cs.Service_ID
-- WHERE sa.Status = 'Pending';

-- View upcoming events
-- SELECT e.*, d.Dept_Name
-- FROM City_Events e
-- JOIN Departments d ON e.Dept_ID = d.Dept_ID
-- WHERE e.Event_Date >= CURDATE()
-- ORDER BY e.Event_Date;

-- View employee hierarchy
-- SELECT e.Name as Employee, e.Designation, d.Dept_Name, s.Name as Supervisor
-- FROM Employees e
-- JOIN Departments d ON e.Dept_ID = d.Dept_ID
-- LEFT JOIN Employees s ON e.Supervisor_ID = s.Emp_ID;

SELECT 'Database setup completed successfully!' as Status;
