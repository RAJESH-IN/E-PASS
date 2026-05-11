using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPass.API.Data;
using MyPass.API.DTOs;

namespace MyPass.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly MyPassDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILogger<SearchController> _log;

    public SearchController(MyPassDbContext db, IMapper mapper, ILogger<SearchController> log)
    { _db = db; _mapper = mapper; _log = log; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<SearchResultDto>>> GlobalSearch(
        [FromQuery] string? q, [FromQuery] string? category)
    {
        try
        {
            var result = new SearchResultDto();
            bool all  = string.IsNullOrWhiteSpace(category);
            var term  = (q ?? "").ToLower().Trim();

            if (all || category == "Employees" || category == "Contractors")
            {
                var empQ = _db.Employees.AsQueryable();
                if (!string.IsNullOrWhiteSpace(term))
                    empQ = empQ.Where(e =>
                        e.FirstName.ToLower().Contains(term) ||
                        e.LastName.ToLower().Contains(term)  ||
                        e.Email.ToLower().Contains(term)     ||
                        (e.BadgeNumber != null && e.BadgeNumber.ToLower().Contains(term)) ||
                        (e.Department  != null && e.Department.ToLower().Contains(term))  ||
                        (e.Company     != null && e.Company.ToLower().Contains(term)));

                if (category == "Contractors")      empQ = empQ.Where(e => e.PersonType == "Contractor");
                else if (category == "Employees")   empQ = empQ.Where(e => e.PersonType == "Employee");

                result.Employees = _mapper.Map<List<EmployeeDto>>(
                    await empQ.OrderBy(e => e.LastName).ToListAsync());
            }

            if (all || category == "Equipment")
            {
                var eqQ = _db.Equipment.Include(e => e.AssignedTo).AsQueryable();
                if (!string.IsNullOrWhiteSpace(term))
                    eqQ = eqQ.Where(e =>
                        e.Name.ToLower().Contains(term)     ||
                        e.Category.ToLower().Contains(term) ||
                        (e.SerialNumber != null && e.SerialNumber.ToLower().Contains(term)) ||
                        (e.AssetTag     != null && e.AssetTag.ToLower().Contains(term))     ||
                        (e.Location     != null && e.Location.ToLower().Contains(term)));
                result.Equipment = _mapper.Map<List<EquipmentDto>>(
                    await eqQ.OrderBy(e => e.Name).ToListAsync());
            }

            if (all || category == "Vehicles")
            {
                var vQ = _db.Vehicles.Include(v => v.AssignedTo).AsQueryable();
                if (!string.IsNullOrWhiteSpace(term))
                    vQ = vQ.Where(v =>
                        v.Make.ToLower().Contains(term)         ||
                        v.Model.ToLower().Contains(term)        ||
                        v.LicensePlate.ToLower().Contains(term) ||
                        (v.Department != null && v.Department.ToLower().Contains(term)));
                result.Vehicles = _mapper.Map<List<VehicleDto>>(
                    await vQ.OrderBy(v => v.Make).ToListAsync());
            }

            return Ok(ApiResponse<SearchResultDto>.Ok(result));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "GlobalSearch failed");
            return StatusCode(500, ApiResponse<SearchResultDto>.Fail($"DB error: {ex.Message}"));
        }
    }
}
