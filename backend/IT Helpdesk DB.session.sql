-- ============================================
-- IT Asset & Help Desk Management System
-- Database Schema
-- ============================================

-- Stores login credentials for everyone (employees, engineers, admins)
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE   -- 'Employee', 'IT Engineer', 'Admin'
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,     -- bcrypt-hashed password, never plain text
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- Extra employee-specific details (linked to a User account)
CREATE TABLE Employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Every physical IT asset (laptop, printer, router, etc.)
CREATE TABLE Assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_tag VARCHAR(50) NOT NULL UNIQUE,   -- e.g. LAP-1001
    asset_type VARCHAR(50) NOT NULL,         -- Laptop, Printer, Router, etc.
    brand VARCHAR(100),
    model VARCHAR(100),
    purchase_date DATE,
    warranty_expiry DATE,
    status VARCHAR(30) DEFAULT 'Available',  -- Available, Assigned, Maintenance, Retired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks WHO has WHICH asset, and for how long
CREATE TABLE Asset_Assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    employee_id INT NOT NULL,
    assigned_date DATE NOT NULL,
    returned_date DATE,                       -- NULL means still in use
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);

-- Support tickets raised by employees
CREATE TABLE Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    raised_by INT NOT NULL,                   -- user_id of employee
    assigned_to INT,                          -- user_id of IT engineer
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'Medium',    -- Low, Medium, High
    status VARCHAR(30) DEFAULT 'Open',        -- Open, Assigned, In Progress, Resolved, Closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (raised_by) REFERENCES Users(user_id),
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id)
);

-- Comments/updates on a ticket (conversation history)
CREATE TABLE Ticket_Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Maintenance history for assets
CREATE TABLE Maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    description TEXT,
    maintenance_date DATE NOT NULL,
    cost DECIMAL(10,2),
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id)
);

-- Notifications for users (e.g. "your ticket was resolved")
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- General activity log for auditability (who did what, when)
CREATE TABLE Activity_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Starter roles so you can register users right away
INSERT INTO Roles (role_name) VALUES ('Employee'), ('IT Engineer'), ('Admin');