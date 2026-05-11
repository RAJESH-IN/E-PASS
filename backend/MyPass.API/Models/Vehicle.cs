namespace MyPass.API.Models;

public class Vehicle
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string? VIN { get; set; }
    public string? Color { get; set; }
    public string VehicleType { get; set; } = "Car"; // Car | Truck | Van | Motorcycle | Heavy Equipment | Other
    public string? Department { get; set; }
    public int? AssignedToId { get; set; }
    public Employee? AssignedTo { get; set; }
    public string Status { get; set; } = "Available"; // Available | In Use | Maintenance | Out of Service
    public DateTime? InsuranceExpiry { get; set; }
    public DateTime? RegistrationExp { get; set; }
    public int Odometer { get; set; } = 0;
    public string? FuelType { get; set; } // Petrol | Diesel | Electric | Hybrid | CNG | Other
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
