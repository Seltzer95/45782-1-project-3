-- DELETE TABLES IF THEY EXIST
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS vacations;
DROP TABLE IF EXISTS users;

-- 1. CREATE USERS TABLE
CREATE TABLE users (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- 2. CREATE VACATIONS TABLE
CREATE TABLE vacations (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    pictureUrl VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- 3. CREATE FOLLOWERS TABLE (Many-to-Many relationship)
CREATE TABLE followers (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    vacationUuid VARCHAR(36) NOT NULL,
    userUuid VARCHAR(36) NOT NULL,
    FOREIGN KEY (vacationUuid) REFERENCES vacations(uuid) ON DELETE CASCADE,
    FOREIGN KEY (userUuid) REFERENCES users(uuid) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (vacationUuid, userUuid)
);

INSERT INTO users (uuid, firstName, lastName, email, password, role, createdAt, updatedAt) VALUES
('b4694d4d-e967-4a0b-9c2b-873b88b72522', 'Admin', 'User', 'admin@vacation.com', '$2b$10$vU8uX3W1pP7K4x9yK2yR9O.R4d8/k2B1sE3fS5p0d3j/lM/lE5vT7', 'admin', NOW(), NOW());

INSERT INTO users (uuid, firstName, lastName, email, password, role, createdAt, updatedAt) VALUES
('c77d5e6e-c198-44d4-9f0a-1a8e9d0b6f5d', 'Regular', 'User', 'user@vacation.com', '$2b$10$vU8uX3W1pP7K4x9yK2yR9O.R4d8/k2B1sE3fS5p0d3j/lM/lE5vT7', 'user', NOW(), NOW());

INSERT INTO vacations (uuid, destination, description, startDate, endDate, price, pictureUrl, createdAt, updatedAt) VALUES
('f8d1e3a4-8b0d-4c3e-9f0a-2a1b3c4d5e6f', 'Tokyo, Japan', 'Experience the blend of futuristic skyscrapers and historic temples in this vibrant metropolis.', '2026-03-10', '2026-03-17', 1800.00, 'uploads/tokyo.jpg', NOW(), NOW()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Paris, France', 'Romantic trip visiting the Eiffel Tower, Louvre, and enjoying world-class cuisine.', '2026-06-01', '2026-06-07', 1500.00, 'uploads/paris.jpg', NOW(), NOW()),
('b6f9a0d1-c2e3-4f5a-6b7c-8d9e0f1a2b3c', 'Maldives, Indian Ocean', 'Stay in an overwater bungalow with crystal clear waters and stunning coral reefs.', '2026-08-15', '2026-08-22', 4500.00, 'uploads/maldives.jpg', NOW(), NOW());

INSERT INTO followers (uuid, vacationUuid, userUuid) VALUES
('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'f8d1e3a4-8b0d-4c3e-9f0a-2a1b3c4d5e6f', 'c77d5e6e-c198-44d4-9f0a-1a8e9d0b6f5d'),
('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c77d5e6e-c198-44d4-9f0a-1a8e9d0b6f5d');

INSERT INTO followers (uuid, vacationUuid, userUuid) VALUES
('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', 'b6f9a0d1-c2e3-4f5a-6b7c-8d9e0f1a2b3c', 'b4694d4d-e967-4a0b-9c2b-873b88b72522');