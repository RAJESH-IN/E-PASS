# 🪪 MyPass – Access Management System

A full-stack access management application for searching and registering **Employees/Contractors**, **Equipment**, and **Vehicles**.

---

## 📁 Project Structure

```
mypass/
├── database/
│   └── 01_create_tables.sql       ← Run this first
├── backend/
│   └── MyPass.API/                ← .NET 8 Web API
│       ├── Controllers/
│       │   ├── EmployeesController.cs
│       │   ├── EquipmentController.cs
│       │   ├── VehiclesController.cs
│       │   └── SearchController.cs
│       ├── Models/
│       ├── DTOs/
│       ├── Data/
│       ├── Mappings/
│       ├── Program.cs
│       └── appsettings.json
└── frontend/
    └── mypass-app/                ← Angular 17 App
        └── src/app/
            ├── components/
            │   ├── dashboard/     ← Search page
            │   ├── register/      ← Registration forms
            │   └── layout/        ← Navbar
            ├── services/
            └── models/
```

---

## 🗄️ Database Setup

1. Open **SQL Server Management Studio** (or Azure Data Studio)
2. Connect to your SQL Server instance
3. Open and run `database/01_create_tables.sql`
4. This creates the `MyPassDB` database with tables + seed data

**Tables created:**
| Table      | Description                          |
|------------|--------------------------------------|
| Employees  | Both employees and contractors       |
| Equipment  | Assets, tools, devices               |
| Vehicles   | Fleet vehicles and heavy equipment   |
| PassLogs   | Audit trail for all access events    |

---

## ⚙️ Backend Setup (.NET 8)

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- SQL Server 2019+ (or LocalDB / Azure SQL)

### Steps

```bash
cd backend/MyPass.API

# Restore packages
dotnet restore

# Update connection string in appsettings.json
# "MyPassDb": "Server=YOUR_SERVER;Database=MyPassDB;Trusted_Connection=True;TrustServerCertificate=True;"

# Run the API
dotnet run
```

The API starts at:
- `https://localhost:7001` (HTTPS)
- `http://localhost:5000` (HTTP)
- Swagger UI: `https://localhost:7001/swagger`

### API Endpoints

| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | /api/search?q=&category=       | Global cross-category search   |
| GET    | /api/employees?search=&status= | List/search employees          |
| POST   | /api/employees                 | Register employee/contractor   |
| PUT    | /api/employees/{id}            | Update employee                |
| DELETE | /api/employees/{id}            | Delete employee                |
| GET    | /api/equipment                 | List/search equipment          |
| POST   | /api/equipment                 | Register equipment             |
| PUT    | /api/equipment/{id}            | Update equipment               |
| DELETE | /api/equipment/{id}            | Delete equipment               |
| GET    | /api/vehicles                  | List/search vehicles           |
| POST   | /api/vehicles                  | Register vehicle               |
| PUT    | /api/vehicles/{id}             | Update vehicle                 |
| DELETE | /api/vehicles/{id}             | Delete vehicle                 |

---

## 🅰️ Frontend Setup (Angular 17)

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- Angular CLI: `npm install -g @angular/cli`

### Steps

```bash
cd frontend/mypass-app

# Install dependencies
npm install

# Start dev server
ng serve
```

App runs at: **http://localhost:4200**

> If your .NET API runs on a different port, update `src/app/services/api.service.ts`:
> ```typescript
> private base = 'https://localhost:YOUR_PORT/api';
> ```

---

## 🖥️ Features

### Dashboard / Search Page (`/`)
- **Unified search bar** — searches across all categories simultaneously
- **Category filter tabs** — All | Employees | Contractors | Equipment | Vehicles
- Live debounced search (350ms) with loading state
- Result cards showing key details for each record type
- Record counts per category

### Register Page (`/register`)
- **Three-tab registration** for Employee/Contractor, Equipment, Vehicle
- Full-featured forms with validation
- Success/error feedback with auto-redirect
- Query parameter support: `/register?type=vehicle` opens the vehicle tab

---

## 🔧 Configuration

### Backend – `appsettings.json`
```json
{
  "ConnectionStrings": {
    "MyPassDb": "Server=localhost;Database=MyPassDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### Frontend – `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'
};
```

---

## 🚀 Production Deployment

### Backend
```bash
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
ng build --configuration production
# Output in dist/mypass-app — serve with Nginx or IIS
```

---

## 📦 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Angular 17, TypeScript, SCSS      |
| Backend  | .NET 8, ASP.NET Core Web API      |
| ORM      | Entity Framework Core 8           |
| Mapping  | AutoMapper 12                     |
| Docs     | Swagger / OpenAPI                 |
| Database | SQL Server 2019+ / Azure SQL      |
