# 🪪 MyPass — Access Management System

> **One platform. Every person, asset and vehicle on your site — searchable, trackable, and always up to date.**

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2019+-CC2927?logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![EF Core](https://img.shields.io/badge/EF_Core-8.0-512BD4?logo=dotnet)](https://learn.microsoft.com/ef/core/)
[![AutoMapper](https://img.shields.io/badge/AutoMapper-12-BE4BDB)](https://automapper.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger)](https://swagger.io/)
[![License](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

---

## 📖 Story & Objective

### The Problem

Organisations managing large sites — construction projects, manufacturing plants, corporate campuses, events — face a daily challenge: **who is on site right now, what equipment are they using, and which vehicle did they arrive in?**

This information is typically scattered across spreadsheets, paper logbooks, WhatsApp messages, and people's heads. When something goes wrong — an incident, an audit, an emergency muster — no one can answer these questions quickly or accurately.

### The Vision

**MyPass** was built to solve exactly this. It is a unified access management registry that consolidates every person, asset and vehicle into a single searchable platform. A security guard, HR manager, or site supervisor can open one screen, type a name or badge number, and instantly see everything they need to know.

### Who It's For

| User | How they use MyPass |
|------|---------------------|
| **Security Officers** | Verify who is on site, check access status, find badge numbers |
| **HR Managers** | Register new employees and contractors, track expiry dates |
| **Site Supervisors** | See which equipment and vehicles are assigned to which person |
| **Operations Teams** | Track asset locations, maintenance status, and odometer readings |
| **Compliance Auditors** | Pull records on demand — no more hunting through spreadsheets |

### Core Objectives

- **Single source of truth** — one system for people, equipment, and vehicles
- **Speed** — find any record in under 3 seconds from a single search bar
- **Simplicity** — register a new record in under 2 minutes, no training required
- **Reliability** — data integrity enforced at both API and database level
- **Extensibility** — clean architecture ready for Phase 2 (auth, QR codes, reporting)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Unified Search** | Single search bar queries Employees, Equipment and Vehicles simultaneously with 350ms debounce |
| 🗂️ **Category Tabs** | Filter: All · Employees · Contractors · Equipment · Vehicles — with live result counts |
| 📝 **Registration Forms** | Three-tab form to register Employees/Contractors, Equipment and Vehicles with full validation |
| ✅ **Smart Validation** | Required field checks, duplicate email/plate/serial detection, clear error messages |
| 🔗 **Assignment Tracking** | Link Equipment and Vehicles to Employees — auto-clears when employee is removed |
| 🏥 **Health Check** | `/health` endpoint exposes DB status + record counts for instant diagnostics |
| 📖 **Swagger UI** | Interactive API documentation auto-generated at `/swagger` |
| 🔄 **CORS-Free Dev** | Angular proxy eliminates CORS entirely in development — zero configuration headaches |

---

## 🎨 Wireframes

### Page 1 — Dashboard / Search

```
┌─────────────────────────────────────────────────────────────────┐
│  🪪 MyPass    Access Management        [Dashboard]  [+ Register] │  ← Navbar
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│          MyPass Search                                            │  ← Hero
│          Search across employees, contractors, equipment...       │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 🔍  Search by name, badge, plate, serial number...    ✕ │   │  ← Search Bar
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   [🔍 All 18] [👤 Employees 4] [🤝 Contractors 2]               │  ← Category
│   [🔧 Equipment 6]  [🚗 Vehicles 6]                              │    Tabs
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  👤 Employees & Contractors                    6    [+ Add New]  │  ← Section
│                                                                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │ AJ  Alice Johnson│ │ BS  Bob Smith     │ │ CW  Carol Williams│ │  ← Result
│  │ Senior Engineer  │ │ Ops Manager       │ │ Network Specialist│ │    Cards
│  │ 📧 alice@acme   │ │ 📧 bob@acme       │ │ 📧 carol@tech    │ │
│  │ 🏢 Engineering  │ │ 🏢 Operations     │ │ 🏢 IT            │ │
│  │ [Employee][Active]│ │ [Employee][Active]│ │[Contractor][Active]│ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│                                                                   │
│  🔧 Equipment                                  6    [+ Add New]  │
│                                                                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │ 🔧 Laptop Pro 15 │ │ 🔧 Safety Drill  │ │ 🔧 iPad Air 5    │ │
│  │ Computing        │ │ Power Tools       │ │ Computing         │ │
│  │ S/N: SN-LT-001  │ │ Tag: AT-0002      │ │ Tag: AT-0004     │ │
│  │ 👤 Alice Johnson │ │ 👤 David Brown    │ │ 👤 Bob Smith     │ │
│  │    [In Use]      │ │    [In Use]       │ │    [In Use]      │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│                                                                   │
│  🚗 Vehicles                                   6    [+ Add New]  │
│                                                                   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │ 🚗 2022 Toyota   │ │ 🚗 2021 Ford     │ │ 🚗 2023 Toyota   │ │
│  │ HiLux  · Truck   │ │ Ranger · Truck   │ │ Corolla · Car    │ │
│  │ 🔖 ACE-001       │ │ 🔖 ACE-002       │ │ 🔖 ACE-003       │ │
│  │ ⛽ Diesel        │ │ ⛽ Diesel        │ │ ⛽ Petrol        │ │
│  │ 👤 Bob Smith     │ │    [Available]   │ │ 👤 Emma Davis    │ │
│  │    [In Use]      │ │                  │ │    [In Use]      │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Page 2 — Register New Record

```
┌─────────────────────────────────────────────────────────────────┐
│  🪪 MyPass    Access Management        [Dashboard]  [+ Register] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Back to Search                                                 │
│  Register New Record                                              │
│  Add a new employee, contractor, equipment or vehicle             │
│                                                                   │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐       │
│  │ 👤             │ │ 🔧             │ │ 🚗             │       │  ← Type
│  │ Employee /     │ │ Equipment      │ │ Vehicle        │       │    Selector
│  │ Contractor     │ │ Assets & tools │ │ Fleet          │       │
│  └────────────────┘ └────────────────┘ └────────────────┘       │
│  [Selected tab shown with blue border]                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PERSONAL INFORMATION                                     │    │
│  │                                                           │    │
│  │  First Name *          Last Name *                        │    │
│  │  ┌─────────────────┐  ┌─────────────────┐               │    │
│  │  │ Alice           │  │ Johnson         │               │    │
│  │  └─────────────────┘  └─────────────────┘               │    │
│  │                                                           │    │
│  │  Email *               Phone                             │    │
│  │  ┌─────────────────┐  ┌─────────────────┐               │    │
│  │  │ alice@acme.com  │  │ +61 400 111 222 │               │    │
│  │  └─────────────────┘  └─────────────────┘               │    │
│  │                                                           │    │
│  │  ROLE & ORGANISATION                                      │    │
│  │                                                           │    │
│  │  Type *                Status                            │    │
│  │  ┌─────────────────┐  ┌─────────────────┐               │    │
│  │  │ Employee      ▼ │  │ Active        ▼ │               │    │
│  │  └─────────────────┘  └─────────────────┘               │    │
│  │                                                           │    │
│  │  Company               Department                        │    │
│  │  ┌─────────────────┐  ┌─────────────────┐               │    │
│  │  │ ACME Corp       │  │ Engineering     │               │    │
│  │  └─────────────────┘  └─────────────────┘               │    │
│  │                                                           │    │
│  │  ACCESS DATES                                             │    │
│  │                                                           │    │
│  │  Start Date            Expiry Date (contractors)         │    │
│  │  ┌─────────────────┐  ┌─────────────────┐               │    │
│  │  │ 05/03/2026   📅 │  │ mm/dd/yyyy   📅 │               │    │
│  │  └─────────────────┘  └─────────────────┘               │    │
│  │                                                           │    │
│  │              [Reset]  [Register Employee / Contractor]   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Data Flow Diagram

### Search Flow — User types in the search bar

```
User types "alice"
      │
      ▼
DashboardComponent
  debounceTime(350ms)          ← waits 350ms after last keystroke
  distinctUntilChanged()       ← skips if same query as before
  switchMap()                  ← cancels previous HTTP request
      │
      ▼
ApiService.search("alice", "All")
  GET /api/search?q=alice&category=
      │
      │  Angular Dev Proxy (proxy.conf.json)
      │  /api/* → http://localhost:61877
      │
      ▼
SearchController.GlobalSearch()
      │
      ├──► _db.Employees.Where(e =>
      │       e.FirstName.Contains("alice") ||
      │       e.LastName.Contains("alice") || ...
      │    ).ToListAsync()
      │
      ├──► _db.Equipment.Include(AssignedTo)
      │       .Where(e => e.Name.Contains("alice") || ...)
      │       .ToListAsync()
      │
      └──► _db.Vehicles.Include(AssignedTo)
              .Where(v => v.Make.Contains("alice") || ...)
              .ToListAsync()
                    │
                    ▼
             SQL Server — MyPassDB
             (3 parallel LINQ queries)
                    │
                    ▼
             AutoMapper maps
             Entity → DTO
             (flattens AssignedToName)
                    │
                    ▼
        ApiResponse<SearchResultDto> {
          success: true,
          data: {
            employees: [...],
            equipment: [...],
            vehicles:  [...]
          }
        }
                    │
                    ▼
        DashboardComponent
        renders result cards
        updates category tab counts
```

### Registration Flow — User submits a new employee

```
User fills form → clicks "Register Employee / Contractor"
      │
      ▼
RegisterComponent.submitEmployee()
  employeeForm.invalid? → markAllAsTouched() → show errors → STOP
      │
      ▼
ApiService.createEmployee(dto)
  POST /api/employees
  Body: { firstName, lastName, email, personType, ... }
      │
      │  Angular Dev Proxy → http://localhost:61877
      │
      ▼
EmployeesController.Create([FromBody] CreateEmployeeDto dto)
      │
      ├── ModelState.IsValid?  No → 400 Bad Request
      │
      ├── Email already exists?  Yes → 409 Conflict
      │
      ├── AutoMapper: CreateEmployeeDto → Employee entity
      │
      ├── _db.Employees.Add(entity)
      │
      ├── _db.SaveChangesAsync()
      │        │
      │        ▼
      │   SQL Server INSERT INTO Employees (...)
      │   UNIQUE constraint checked by DB
      │
      └── 201 Created → ApiResponse<EmployeeDto>
                    │
                    ▼
        RegisterComponent
        shows success message
        redirects to dashboard after 2.5s
```

### Data Relationships

```
Employees (master person table)
  ┌─────────────────────────────────────────┐
  │ Id │ FirstName │ LastName │ PersonType  │
  │  1 │ Alice     │ Johnson  │ Employee    │
  │  3 │ Carol     │ Williams │ Contractor  │
  └──────────────────────────┬──────────────┘
                             │ 1
                             │   AssignedToId (FK, SET NULL on delete)
              ┌──────────────┴──────────────┐
              │                             │
           ───┘ n                      n ───┘
  Equipment                        Vehicles
  ┌──────────────────────┐   ┌────────────────────────┐
  │ Id │ Name   │ Status │   │ Id │ LicensePlate│Status │
  │  1 │ Laptop │ In Use │   │  1 │ ACE-001     │In Use │
  │  2 │ Drill  │ In Use │   │  3 │ ACE-003     │In Use │
  └──────────────────────┘   └────────────────────────┘

PassLogs (audit trail — every create/update/delete logged)
  ┌─────────────────────────────────────────────────────┐
  │ EntityType │ EntityId │ Action  │ PerformedBy       │
  │ Employee   │    1     │ Created │ admin@mypass.com  │
  │ Vehicle    │    1     │ Updated │ admin@mypass.com  │
  └─────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### System Architecture (3-Tier)

```
╔══════════════════════════════════════════════════════════════════╗
║  PRESENTATION TIER                                               ║
║  Angular 17 SPA — localhost:4200                                 ║
║                                                                  ║
║  ┌─────────────────────┐    ┌──────────────────────────────┐   ║
║  │   DashboardComponent │    │     RegisterComponent         │   ║
║  │                     │    │                              │   ║
║  │  ┌───────────────┐  │    │  ┌────────────────────────┐ │   ║
║  │  │  Search Bar   │  │    │  │  Employee / Contractor  │ │   ║
║  │  │  (debounced)  │  │    │  │  Equipment              │ │   ║
║  │  └───────────────┘  │    │  │  Vehicle    (tabs)      │ │   ║
║  │  ┌───────────────┐  │    │  └────────────────────────┘ │   ║
║  │  │ Category Tabs │  │    │  Angular Reactive Forms      │   ║
║  │  └───────────────┘  │    │  Validators / markAllTouched │   ║
║  │  ┌───────────────┐  │    └──────────────────────────────┘   ║
║  │  │ Result Cards  │  │                                        ║
║  │  └───────────────┘  │    NavbarComponent (sticky routing)    ║
║  └─────────────────────┘                                        ║
║                                                                  ║
║  ApiService — base = '/api' (relative, proxy handles routing)   ║
║  RxJS: debounceTime · distinctUntilChanged · switchMap          ║
╚══════════════════════╦═══════════════════════════════════════════╝
                       ║
                       ║  Angular Dev Proxy (proxy.conf.json)
                       ║  /api/* → http://localhost:61877
                       ║  (eliminates CORS — browser stays on :4200)
                       ║
╔══════════════════════╩═══════════════════════════════════════════╗
║  APPLICATION TIER                                                ║
║  .NET 8 Web API — localhost:61877                                ║
║                                                                  ║
║  Program.cs Middleware Pipeline (ORDER IS CRITICAL):            ║
║  app.UseCors()           ← MUST be first                        ║
║  app.UseSwagger()                                               ║
║  app.UseAuthorization()                                         ║
║  app.MapControllers()                                           ║
║                                                                  ║
║  ┌────────────┐ ┌──────────────┐ ┌───────────┐ ┌───────────┐  ║
║  │  Search    │ │  Employees   │ │ Equipment │ │ Vehicles  │  ║
║  │ Controller │ │  Controller  │ │Controller │ │Controller │  ║
║  │            │ │              │ │           │ │           │  ║
║  │GET /search │ │GET/POST/PUT  │ │GET/POST   │ │GET/POST   │  ║
║  │?q=&cat=    │ │DELETE        │ │PUT/DELETE │ │PUT/DELETE │  ║
║  └────────────┘ └──────────────┘ └───────────┘ └───────────┘  ║
║                                                                  ║
║  AutoMapper 12 — Entity ↔ DTO (flattens navigation props)      ║
║  ApiResponse<T> — consistent { success, message, data } shape  ║
║                                                                  ║
║  MyPassDbContext (EF Core 8)                                    ║
║  · Explicit HasColumnName() on every column                     ║
║  · PersonType / VehicleType mapped (not generic "Type")         ║
║  · SetNull FK behaviour on employee deletion                    ║
╚══════════════════════╦═══════════════════════════════════════════╝
                       ║
                       ║  Entity Framework Core 8
                       ║  SQL Client / LINQ queries
                       ║
╔══════════════════════╩═══════════════════════════════════════════╗
║  DATA TIER                                                       ║
║  SQL Server — MyPassDB                                           ║
║                                                                  ║
║  ┌────────────┐  ┌───────────┐  ┌──────────┐  ┌────────────┐  ║
║  │ Employees  │  │ Equipment │  │ Vehicles │  │ PassLogs   │  ║
║  │            │  │           │  │          │  │            │  ║
║  │ UNIQUE:    │  │ FK →      │  │ FK →     │  │ EntityType │  ║
║  │ Email      │◄─┤ Employees │  │ Employees│  │ EntityId   │  ║
║  │ BadgeNo    │  │ (SET NULL)│  │ (SET NULL│  │ Action     │  ║
║  │            │  │           │  │ on del.) │  │ CreatedAt  │  ║
║  │ PersonType:│  │ UNIQUE:   │  │ UNIQUE:  │  │            │  ║
║  │ Employee   │  │ Serial    │  │ Plate    │  │ Audit all  │  ║
║  │ Contractor │  │ AssetTag  │  │          │  │ mutations  │  ║
║  └────────────┘  └───────────┘  └──────────┘  └────────────┘  ║
║                                                                  ║
║  Indexes: Status, PersonType, AssignedToId (FK columns)        ║
║  Filtered unique indexes on nullable cols (BadgeNo, SerialNo)  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Component Architecture (Angular)

```
AppComponent
  └── NavbarComponent          (standalone, RouterLink)
  └── <router-outlet>
        ├── DashboardComponent (lazy-loaded, default route '/')
        │     ├── ApiService.search()
        │     ├── Subject<{term, cat}> → debounce pipeline
        │     └── Result card templates (Employee/Equipment/Vehicle)
        │
        └── RegisterComponent  (lazy-loaded, route '/register')
              ├── FormBuilder → employeeForm / equipmentForm / vehicleForm
              ├── ApiService.createEmployee() / createEquipment() / createVehicle()
              └── Router.navigate(['/']) on success
```

### Backend Layer Diagram

```
HTTP Request
    │
    ▼
Controller (validates ModelState, checks duplicates)
    │
    ▼
AutoMapper (DTO → Entity or Entity → DTO)
    │
    ▼
MyPassDbContext (EF Core — explicit column mappings)
    │
    ▼
SQL Server (parameterised queries, UNIQUE + FK constraints)
    │
    ▼
ApiResponse<T> { success, message, data }
    │
    ▼
HTTP Response (200 / 201 / 400 / 404 / 409 / 500)
```

---

## 🏗️ Architecture Overview

```
Browser (localhost:4200)
  │
  │  Angular 17 SPA — Reactive Forms, RxJS, HttpClient
  │
  ├─ DashboardComponent   → Live search with category tabs
  └─ RegisterComponent    → Employee / Equipment / Vehicle forms
         │
         │  /api/* → Angular Dev Proxy (proxy.conf.json)
         │           Forwards to localhost:61877 — Zero CORS issues
         ▼
.NET 8 Web API (localhost:61877)
  │
  ├─ SearchController      GET /api/search
  ├─ EmployeesController   GET / POST / PUT / DELETE /api/employees
  ├─ EquipmentController   GET / POST / PUT / DELETE /api/equipment
  └─ VehiclesController    GET / POST / PUT / DELETE /api/vehicles
         │
         │  Entity Framework Core 8 · AutoMapper 12
         ▼
SQL Server — MyPassDB
  ├─ Employees   (PersonType: Employee | Contractor)
  ├─ Equipment   (FK → Employees, SET NULL on delete)
  ├─ Vehicles    (FK → Employees, SET NULL on delete)
  └─ PassLogs    (Audit trail)
```

---

## 🚀 Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Node.js 18+](https://nodejs.org)
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`
- SQL Server 2019+ (or SQL Server Express / LocalDB)

### 1 — Database
```sql
-- Open SQL Server Management Studio
-- File → Open → database/01_create_tables.sql → Execute (F5)
-- Creates MyPassDB with all tables + 6 seed records each
```

Verify:
```sql
USE MyPassDB;
SELECT COUNT(*) FROM Employees;  -- 6
SELECT COUNT(*) FROM Equipment;  -- 6
SELECT COUNT(*) FROM Vehicles;   -- 6
```

### 2 — Backend
```bash
cd backend/MyPass.API
dotnet restore
dotnet run
# ✅ Database connection: OK
# API  → http://localhost:61877
# Docs → http://localhost:61877/swagger
# Health → http://localhost:61877/health
```

### 3 — Frontend
```bash
cd frontend/mypass-app
npm install
npm start        # ng serve --proxy-config proxy.conf.json
```

Open **http://localhost:4200** 🎉

---

## 📁 Project Structure

```
MyPass/
├── 📂 database/
│   └── 01_create_tables.sql          ← Run this first
│
├── 📂 backend/
│   └── MyPass.API/
│       ├── Controllers/
│       │   ├── SearchController.cs   ← Cross-category search
│       │   ├── EmployeesController.cs
│       │   ├── EquipmentController.cs
│       │   └── VehiclesController.cs
│       ├── Models/                   ← EF Core entities
│       ├── DTOs/Dtos.cs              ← DTOs + ApiResponse<T>
│       ├── Data/MyPassDbContext.cs   ← Explicit column mapping
│       ├── Mappings/MappingProfile.cs ← AutoMapper
│       ├── Properties/launchSettings.json ← Locks port 61877
│       ├── Program.cs               ← DI · CORS · Health check
│       └── appsettings.json
│
└── 📂 frontend/
    └── mypass-app/
        ├── proxy.conf.json           ← /api/* → localhost:61877
        ├── angular.json
        ├── package.json              ← npm start uses proxy
        └── src/app/
            ├── components/
            │   ├── dashboard/        ← Search page
            │   ├── register/         ← Registration forms
            │   └── layout/           ← Navbar
            ├── services/api.service.ts
            └── models/models.ts
```

---

## 🔌 API Reference

All endpoints return `ApiResponse<T>`:
```json
{ "success": true, "message": null, "data": { ... } }
```

### Global Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=alice&category=All` | `category`: All \| Employees \| Contractors \| Equipment \| Vehicles |

### Employees & Contractors
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/employees?search=&personType=&status=` | 200 | List with optional filters |
| `GET` | `/api/employees/{id}` | 200 / 404 | Get by ID |
| `POST` | `/api/employees` | 201 / 409 | Register (409 = duplicate email) |
| `PUT` | `/api/employees/{id}` | 200 / 404 | Update record |
| `DELETE` | `/api/employees/{id}` | 200 / 404 | Delete record |

### Equipment
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/equipment?search=&category=&status=` | 200 | List with optional filters |
| `GET` | `/api/equipment/{id}` | 200 / 404 | Includes AssignedToName |
| `POST` | `/api/equipment` | 201 / 409 | Register (409 = duplicate serial) |
| `PUT` | `/api/equipment/{id}` | 200 / 404 | Update record |
| `DELETE` | `/api/equipment/{id}` | 200 / 404 | Delete record |

### Vehicles
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/vehicles?search=&vehicleType=&status=` | 200 | List with optional filters |
| `GET` | `/api/vehicles/{id}` | 200 / 404 | Includes AssignedToName |
| `POST` | `/api/vehicles` | 201 / 409 | Register (409 = duplicate plate) |
| `PUT` | `/api/vehicles/{id}` | 200 / 404 | Update record |
| `DELETE` | `/api/vehicles/{id}` | 200 / 404 | Delete record |

### Diagnostics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | DB connection status + record counts |
| `GET` | `/swagger` | Interactive API docs |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular (Standalone Components) | 17 |
| Language | TypeScript | 5.4 |
| Styling | SCSS + CSS custom properties | — |
| HTTP | Angular HttpClient + Dev Proxy | — |
| Reactive | RxJS (debounce, switchMap) | 7.8 |
| Backend | ASP.NET Core Web API | .NET 8 |
| ORM | Entity Framework Core | 8.0 |
| Mapping | AutoMapper | 12 |
| API Docs | Swagger / Swashbuckle | 6.8 |
| Database | SQL Server | 2019+ |

---

## 🔧 Configuration

### Backend — `appsettings.json`
```json
{
  "ConnectionStrings": {
    "MyPassDb": "Server=localhost;Database=MyPassDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Urls": "http://localhost:61877"
}
```

### Frontend — `proxy.conf.json`
```json
{
  "/api": {
    "target": "http://localhost:61877",
    "secure": false,
    "changeOrigin": true
  }
}
```

> ⚠️ If your backend starts on a different port, update `target` here and restart `npm start`.

---

## ❓ Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ERR_CONNECTION_REFUSED` on `/api` | Backend not running — `dotnet run` in `backend/MyPass.API/` |
| `404` on `/api/employees` | Proxy port mismatch — check `proxy.conf.json` target |
| `500 Internal Server Error` | Open `/health` — shows exact DB error |
| `Cannot open database 'MyPassDB'` | Run `01_create_tables.sql` in SSMS first |
| CORS preflight error | `UseCors()` must be first in `Program.cs` |
| Port changes every VS restart | Add `launchSettings.json` to lock port to 61877 |

---

## 🗺️ Roadmap

### ✅ Phase 1 — Complete
- [x] Unified search across all categories
- [x] Employee, Equipment, Vehicle CRUD
- [x] Angular proxy CORS solution
- [x] SQL Server with seed data + constraints
- [x] Swagger documentation
- [x] Health check endpoint
- [x] Full error handling (try/catch in all controllers)

### ⏳ Phase 2 — Planned
- [ ] JWT authentication (ASP.NET Core Identity)
- [ ] Role-based access: Admin / Viewer / Auditor
- [ ] Pagination for large datasets
- [ ] QR code badge generation and scanning
- [ ] Export to PDF / Excel
- [ ] Email notifications on expiry dates
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] AWS deployment (Elastic Beanstalk + RDS + S3 + CloudFront)

---

## 🏷️ Key Design Decisions

**Angular Proxy over CORS headers** — The dev proxy routes `/api/*` through the Angular dev server itself, so the browser never makes cross-origin requests. Zero CORS configuration needed.

**`AllowAnyOrigin` in development** — Paired with the proxy, this ensures any dev machine works without touching config. Replace with specific origin in production.

**Explicit EF Core column mapping** — `HasColumnName()` on every column prevents EF from auto-generating wrong names. Critical for `PersonType` and `VehicleType` which would otherwise default to `Type`.

**`ApiResponse<T>` wrapper** — All 15 endpoints return `{ success, message, data }`. Angular's error handler reads `err?.error?.message` for every call — consistent, predictable.

**Fixed port via `launchSettings.json`** — Locks the backend to 61877 so Visual Studio never assigns a random port that breaks the proxy.

**Try/catch in every controller action** — 500 errors return the actual exception message in `ApiResponse.message` so developers see the exact SQL or EF error immediately.

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

## 👤 Author

Built with ❤️ using Angular 17 + .NET 8 + SQL Server

> *"The best access management system is the one your team actually uses."*

---

*For full project documentation see `docs/`. For API testing use Swagger at `/swagger` when the backend is running.*
