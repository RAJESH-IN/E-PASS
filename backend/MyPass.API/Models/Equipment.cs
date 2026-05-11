namespace MyPass.API.Models;

public class Equipment
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
    public Employee? AssignedTo { get; set; }
    public string Status { get; set; } = "Available"; // Available | In Use | Maintenance | Retired
    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyExpiry { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
