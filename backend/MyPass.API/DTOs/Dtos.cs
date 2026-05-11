using System.ComponentModel.DataAnnotations;

namespace MyPass.API.DTOs;

// ── Shared ──────────────────────────────────────────────────────────

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string? msg = null)
        => new() { Success = true, Data = data, Message = msg };

    public static ApiResponse<T> Fail(string msg)
        => new() { Success = false, Message = msg };
}

public class SearchResultDto
{
    public List<EmployeeDto> Employees { get; set; } = new();
    public List<EquipmentDto> Equipment { get; set; } = new();
    public List<VehicleDto> Vehicles { get; set; } = new();
}

// ── Employee ─────────────────────────────────────────────────────────

public class EmployeeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string PersonType { get; set; } = "Employee";
    public string? Company { get; set; }
    public string? Department { get; set; }
    public string? JobTitle { get; set; }
    public string? BadgeNumber { get; set; }
    public string Status { get; set; } = "Active";
    public string? PhotoUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateEmployeeDto
{
    [Required] public string FirstName { get; set; } = string.Empty;
    [Required] public string LastName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    [Required] public string PersonType { get; set; } = "Employee";
    public string? Company { get; set; }
    public string? Department { get; set; }
    public string? JobTitle { get; set; }
    public string? BadgeNumber { get; set; }
    public string Status { get; set; } = "Active";
    public string? PhotoUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
}

public class UpdateEmployeeDto : CreateEmployeeDto { }

// ── Equipment ────────────────────────────────────────────────────────

public class EquipmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public string? AssetTag { get; set; }
    public string? Manufacturer { get; set; }
    public string? Model { get; set; }
    public string? Location { get; set; }
    public int? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyExpiry { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateEquipmentDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string Category { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public string? AssetTag { get; set; }
    public string? Manufacturer { get; set; }
    public string? Model { get; set; }
    public string? Location { get; set; }
    public int? AssignedToId { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyExpiry { get; set; }
    public string? Notes { get; set; }
}

public class UpdateEquipmentDto : CreateEquipmentDto { }

// ── Vehicle ──────────────────────────────────────────────────────────

public class VehicleDto
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string? VIN { get; set; }
    public string? Color { get; set; }
    public string VehicleType { get; set; } = "Car";
    public string? Department { get; set; }
    public int? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime? InsuranceExpiry { get; set; }
    public DateTime? RegistrationExp { get; set; }
    public int Odometer { get; set; }
    public string? FuelType { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateVehicleDto
{
    [Required] public string Make { get; set; } = string.Empty;
    [Required] public string Model { get; set; } = string.Empty;
    [Required, Range(1900, 2100)] public int Year { get; set; }
    [Required] public string LicensePlate { get; set; } = string.Empty;
    public string? VIN { get; set; }
    public string? Color { get; set; }
    [Required] public string VehicleType { get; set; } = "Car";
    public string? Department { get; set; }
    public int? AssignedToId { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime? InsuranceExpiry { get; set; }
    public DateTime? RegistrationExp { get; set; }
    public int Odometer { get; set; } = 0;
    public string? FuelType { get; set; }
    public string? Notes { get; set; }
}

public class UpdateVehicleDto : CreateVehicleDto { }
