namespace MyPass.API.Models;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string PersonType { get; set; } = "Employee"; // Employee | Contractor
    public string? Company { get; set; }
    public string? Department { get; set; }
    public string? JobTitle { get; set; }
    public string? BadgeNumber { get; set; }
    public string Status { get; set; } = "Active"; // Active | Inactive | Suspended
    public string? PhotoUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Equipment> AssignedEquipment { get; set; } = new List<Equipment>();
    public ICollection<Vehicle> AssignedVehicles { get; set; } = new List<Vehicle>();
}
