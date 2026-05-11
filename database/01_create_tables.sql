-- ============================================================
-- MyPass Database - Table Scripts
-- Compatible: SQL Server 2019+ / Azure SQL
-- ============================================================

CREATE DATABASE MyPassDB;
GO

USE MyPassDB;
GO

-- ============================================================
-- Employees (covers both Employees and Contractors)
-- ============================================================
CREATE TABLE Employees (
    Id           INT           IDENTITY(1,1) PRIMARY KEY,
    FirstName    NVARCHAR(100) NOT NULL,
    LastName     NVARCHAR(100) NOT NULL,
    Email        NVARCHAR(200) NOT NULL,
    Phone        NVARCHAR(30)  NULL,
    PersonType   NVARCHAR(20)  NOT NULL DEFAULT 'Employee'
                               CHECK (PersonType IN ('Employee','Contractor')),
    Company      NVARCHAR(200) NULL,
    Department   NVARCHAR(100) NULL,
    JobTitle     NVARCHAR(100) NULL,
    BadgeNumber  NVARCHAR(50)  NULL,
    Status       NVARCHAR(20)  NOT NULL DEFAULT 'Active'
                               CHECK (Status IN ('Active','Inactive','Suspended')),
    PhotoUrl     NVARCHAR(500) NULL,
    StartDate    DATE          NULL,
    ExpiryDate   DATE          NULL,
    CreatedAt    DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt    DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Employees_Email       UNIQUE (Email),
    CONSTRAINT UQ_Employees_BadgeNumber UNIQUE (BadgeNumber)
);
GO

-- ============================================================
-- Equipment
-- ============================================================
CREATE TABLE Equipment (
    Id             INT           IDENTITY(1,1) PRIMARY KEY,
    Name           NVARCHAR(200) NOT NULL,
    Category       NVARCHAR(100) NOT NULL,
    SerialNumber   NVARCHAR(100) NULL,
    AssetTag       NVARCHAR(100) NULL,
    Manufacturer   NVARCHAR(200) NULL,
    Model          NVARCHAR(200) NULL,
    Location       NVARCHAR(200) NULL,
    AssignedToId   INT           NULL REFERENCES Employees(Id) ON DELETE SET NULL,
    Status         NVARCHAR(20)  NOT NULL DEFAULT 'Available'
                                 CHECK (Status IN ('Available','In Use','Maintenance','Retired')),
    PurchaseDate   DATE          NULL,
    WarrantyExpiry DATE          NULL,
    Notes          NVARCHAR(MAX) NULL,
    CreatedAt      DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt      DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Equipment_SerialNumber UNIQUE (SerialNumber),
    CONSTRAINT UQ_Equipment_AssetTag     UNIQUE (AssetTag)
);
GO

-- ============================================================
-- Vehicles
-- ============================================================
CREATE TABLE Vehicles (
    Id              INT           IDENTITY(1,1) PRIMARY KEY,
    Make            NVARCHAR(100) NOT NULL,
    Model           NVARCHAR(100) NOT NULL,
    Year            INT           NOT NULL,
    LicensePlate    NVARCHAR(50)  NOT NULL,
    VIN             NVARCHAR(17)  NULL,
    Color           NVARCHAR(50)  NULL,
    VehicleType     NVARCHAR(50)  NOT NULL DEFAULT 'Car'
                                  CHECK (VehicleType IN ('Car','Truck','Van','Motorcycle','Heavy Equipment','Other')),
    Department      NVARCHAR(100) NULL,
    AssignedToId    INT           NULL REFERENCES Employees(Id) ON DELETE SET NULL,
    Status          NVARCHAR(20)  NOT NULL DEFAULT 'Available'
                                  CHECK (Status IN ('Available','In Use','Maintenance','Out of Service')),
    InsuranceExpiry DATE          NULL,
    RegistrationExp DATE          NULL,
    Odometer        INT           NOT NULL DEFAULT 0,
    FuelType        NVARCHAR(30)  NULL
                                  CHECK (FuelType IN ('Petrol','Diesel','Electric','Hybrid','CNG','Other')),
    Notes           NVARCHAR(MAX) NULL,
    CreatedAt       DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Vehicles_LicensePlate UNIQUE (LicensePlate)
);
GO

-- ============================================================
-- PassLogs – audit trail
-- ============================================================
CREATE TABLE PassLogs (
    Id          INT           IDENTITY(1,1) PRIMARY KEY,
    EntityType  NVARCHAR(20)  NOT NULL CHECK (EntityType IN ('Employee','Equipment','Vehicle')),
    EntityId    INT           NOT NULL,
    Action      NVARCHAR(50)  NOT NULL,
    PerformedBy NVARCHAR(200) NULL,
    Notes       NVARCHAR(500) NULL,
    CreatedAt   DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);
GO

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IX_Employees_Status     ON Employees  (Status);
CREATE INDEX IX_Employees_PersonType ON Employees  (PersonType);
CREATE INDEX IX_Equipment_Status     ON Equipment  (Status);
CREATE INDEX IX_Equipment_Assigned   ON Equipment  (AssignedToId);
CREATE INDEX IX_Vehicles_Status      ON Vehicles   (Status);
CREATE INDEX IX_Vehicles_Assigned    ON Vehicles   (AssignedToId);
CREATE INDEX IX_PassLogs_Entity      ON PassLogs   (EntityType, EntityId);
GO

-- ============================================================
-- Seed Data
-- ============================================================
INSERT INTO Employees (FirstName,LastName,Email,Phone,PersonType,Company,Department,JobTitle,BadgeNumber,Status,StartDate,ExpiryDate)
VALUES
 ('Alice',   'Johnson',  'alice.johnson@acme.com',    '+61 400 111 222','Employee',   'ACME Corp',       'Engineering',  'Senior Engineer',    'EMP-001','Active',   '2022-01-15', NULL),
 ('Bob',     'Smith',    'bob.smith@acme.com',         '+61 400 222 333','Employee',   'ACME Corp',       'Operations',   'Operations Manager', 'EMP-002','Active',   '2021-06-01', NULL),
 ('Carol',   'Williams', 'carol.williams@techco.com',  '+61 400 333 444','Contractor', 'TechCo Services', 'IT',           'Network Specialist', 'CON-001','Active',   '2024-01-01', '2024-12-31'),
 ('David',   'Brown',    'david.brown@buildfast.com',  '+61 400 444 555','Contractor', 'BuildFast Pty',   'Construction', 'Site Foreman',       'CON-002','Active',   '2024-03-01', '2024-09-30'),
 ('Emma',    'Davis',    'emma.davis@acme.com',        '+61 400 555 666','Employee',   'ACME Corp',       'HR',           'HR Manager',         'EMP-003','Active',   '2020-09-10', NULL),
 ('Frank',   'Miller',   'frank.miller@acme.com',      '+61 400 666 777','Employee',   'ACME Corp',       'Finance',      'Finance Analyst',    'EMP-004','Inactive', '2019-04-22', NULL);

INSERT INTO Equipment (Name,Category,SerialNumber,AssetTag,Manufacturer,Model,Location,AssignedToId,Status,PurchaseDate,WarrantyExpiry)
VALUES
 ('Laptop Pro 15',      'Computing',   'SN-LT-001', 'AT-0001','Dell',       'XPS 15 9530',     'Head Office',1,'In Use',    '2023-01-10','2026-01-10'),
 ('Safety Drill',       'Power Tools', 'SN-DRL-01', 'AT-0002','Bosch',      'GBH 2-26 DFR',    'Warehouse',  4,'In Use',    '2022-06-15','2024-06-15'),
 ('Network Switch 48P', 'Networking',  'SN-SW-001', 'AT-0003','Cisco',      'Catalyst 2960-X', 'Server Room',3,'In Use',    '2021-11-20','2024-11-20'),
 ('iPad Air 5',         'Computing',   'SN-TAB-01', 'AT-0004','Apple',      'iPad Air 5th Gen','Head Office',2,'In Use',    '2023-05-05','2025-05-05'),
 ('Thermal Camera',     'Inspection',  'SN-TC-001', 'AT-0005','FLIR',       'E8-XT',           'Warehouse', NULL,'Available','2022-09-01','2025-09-01'),
 ('Generator 10kVA',    'Power',       'SN-GEN-01', 'AT-0006','Kohler',     'KD10000E',        'Site B',    NULL,'Maintenance','2020-03-15','2023-03-15');

INSERT INTO Vehicles (Make,Model,Year,LicensePlate,VIN,Color,VehicleType,Department,AssignedToId,Status,InsuranceExpiry,RegistrationExp,Odometer,FuelType)
VALUES
 ('Toyota',     'HiLux',   2022,'ACE-001','JTFB32EX2N5012345','White', 'Truck',           'Operations',  2,   'In Use',     '2025-03-31','2025-03-31',45200,'Diesel'),
 ('Ford',       'Ranger',  2021,'ACE-002','6FPAA8JX6MN234567','Silver','Truck',           'Engineering', 1,   'Available',  '2025-06-30','2025-06-30',62100,'Diesel'),
 ('Toyota',     'Corolla', 2023,'ACE-003','SB1K53AE0PE345678','Blue',  'Car',             'HR',          5,   'In Use',     '2025-12-31','2025-12-31',18900,'Petrol'),
 ('Hyundai',    'iLoad',   2020,'ACE-004','KMHSH81KXLU456789','White', 'Van',             'Operations',  NULL,'Maintenance','2024-11-30','2024-11-30',89500,'Diesel'),
 ('Tesla',      'Model 3', 2024,'ACE-005','5YJ3E1EA9PF567890','Black', 'Car',             'Finance',     4,   'In Use',     '2026-01-31','2026-01-31',5400, 'Electric'),
 ('Caterpillar','950 Loader',2019,'ACE-006',NULL,              NULL,   'Heavy Equipment', 'Construction',NULL,'Available',  '2025-07-31','2025-07-31',0,    'Diesel');
GO

PRINT 'MyPass DB setup complete.';
GO
