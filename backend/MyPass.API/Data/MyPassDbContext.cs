using Microsoft.EntityFrameworkCore;
using MyPass.API.Models;

namespace MyPass.API.Data;

public class MyPassDbContext : DbContext
{
    public MyPassDbContext(DbContextOptions<MyPassDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // ── Employee ──────────────────────────────────────────────────
        mb.Entity<Employee>(e =>
        {
            e.ToTable("Employees");
            e.HasKey(x => x.Id);
            e.Property(x => x.FirstName).HasColumnName("FirstName").HasMaxLength(100).IsRequired();
            e.Property(x => x.LastName).HasColumnName("LastName").HasMaxLength(100).IsRequired();
            e.Property(x => x.Email).HasColumnName("Email").HasMaxLength(200).IsRequired();
            e.Property(x => x.Phone).HasColumnName("Phone").HasMaxLength(30);
            // Column in DB is "PersonType"
            e.Property(x => x.PersonType).HasColumnName("PersonType").HasMaxLength(20).HasDefaultValue("Employee");
            e.Property(x => x.Company).HasColumnName("Company").HasMaxLength(200);
            e.Property(x => x.Department).HasColumnName("Department").HasMaxLength(100);
            e.Property(x => x.JobTitle).HasColumnName("JobTitle").HasMaxLength(100);
            e.Property(x => x.BadgeNumber).HasColumnName("BadgeNumber").HasMaxLength(50);
            e.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20).HasDefaultValue("Active");
            e.Property(x => x.PhotoUrl).HasColumnName("PhotoUrl").HasMaxLength(500);
            e.Property(x => x.StartDate).HasColumnName("StartDate");
            e.Property(x => x.ExpiryDate).HasColumnName("ExpiryDate");
            e.Property(x => x.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(x => x.Email).IsUnique();
            e.HasIndex(x => x.BadgeNumber).IsUnique().HasFilter("[BadgeNumber] IS NOT NULL");
            e.Ignore(x => x.AssignedEquipment);
            e.Ignore(x => x.AssignedVehicles);
        });

        // ── Equipment ─────────────────────────────────────────────────
        mb.Entity<Equipment>(e =>
        {
            e.ToTable("Equipment");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasColumnName("Name").HasMaxLength(200).IsRequired();
            e.Property(x => x.Category).HasColumnName("Category").HasMaxLength(100).IsRequired();
            e.Property(x => x.SerialNumber).HasColumnName("SerialNumber").HasMaxLength(100);
            e.Property(x => x.AssetTag).HasColumnName("AssetTag").HasMaxLength(100);
            e.Property(x => x.Manufacturer).HasColumnName("Manufacturer").HasMaxLength(200);
            e.Property(x => x.Model).HasColumnName("Model").HasMaxLength(200);
            e.Property(x => x.Location).HasColumnName("Location").HasMaxLength(200);
            e.Property(x => x.AssignedToId).HasColumnName("AssignedToId");
            e.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20).HasDefaultValue("Available");
            e.Property(x => x.PurchaseDate).HasColumnName("PurchaseDate");
            e.Property(x => x.WarrantyExpiry).HasColumnName("WarrantyExpiry");
            e.Property(x => x.Notes).HasColumnName("Notes");
            e.Property(x => x.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(x => x.SerialNumber).IsUnique().HasFilter("[SerialNumber] IS NOT NULL");
            e.HasIndex(x => x.AssetTag).IsUnique().HasFilter("[AssetTag] IS NOT NULL");
            e.HasOne(x => x.AssignedTo)
             .WithMany()
             .HasForeignKey(x => x.AssignedToId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Vehicle ───────────────────────────────────────────────────
        mb.Entity<Vehicle>(e =>
        {
            e.ToTable("Vehicles");
            e.HasKey(x => x.Id);
            e.Property(x => x.Make).HasColumnName("Make").HasMaxLength(100).IsRequired();
            e.Property(x => x.Model).HasColumnName("Model").HasMaxLength(100).IsRequired();
            e.Property(x => x.Year).HasColumnName("Year").IsRequired();
            e.Property(x => x.LicensePlate).HasColumnName("LicensePlate").HasMaxLength(50).IsRequired();
            e.Property(x => x.VIN).HasColumnName("VIN").HasMaxLength(17);
            e.Property(x => x.Color).HasColumnName("Color").HasMaxLength(50);
            // Column in DB is "VehicleType"
            e.Property(x => x.VehicleType).HasColumnName("VehicleType").HasMaxLength(50).HasDefaultValue("Car");
            e.Property(x => x.Department).HasColumnName("Department").HasMaxLength(100);
            e.Property(x => x.AssignedToId).HasColumnName("AssignedToId");
            e.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20).HasDefaultValue("Available");
            e.Property(x => x.InsuranceExpiry).HasColumnName("InsuranceExpiry");
            e.Property(x => x.RegistrationExp).HasColumnName("RegistrationExp");
            e.Property(x => x.Odometer).HasColumnName("Odometer");
            e.Property(x => x.FuelType).HasColumnName("FuelType").HasMaxLength(30);
            e.Property(x => x.Notes).HasColumnName("Notes");
            e.Property(x => x.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.UpdatedAt).HasColumnName("UpdatedAt").HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(x => x.LicensePlate).IsUnique();
            e.HasOne(x => x.AssignedTo)
             .WithMany()
             .HasForeignKey(x => x.AssignedToId)
             .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
