using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPass.API.Data;
using MyPass.API.DTOs;
using MyPass.API.Models;

namespace MyPass.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly MyPassDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILogger<VehiclesController> _log;

    public VehiclesController(MyPassDbContext db, IMapper mapper, ILogger<VehiclesController> log)
    { _db = db; _mapper = mapper; _log = log; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<VehicleDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? vehicleType, [FromQuery] string? status)
    {
        try
        {
            var q = _db.Vehicles.Include(v => v.AssignedTo).AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                q = q.Where(v =>
                    v.Make.ToLower().Contains(s)         ||
                    v.Model.ToLower().Contains(s)        ||
                    v.LicensePlate.ToLower().Contains(s) ||
                    (v.Color      != null && v.Color.ToLower().Contains(s))      ||
                    (v.Department != null && v.Department.ToLower().Contains(s)) ||
                    (v.VIN        != null && v.VIN.ToLower().Contains(s)));
            }
            if (!string.IsNullOrWhiteSpace(vehicleType)) q = q.Where(v => v.VehicleType == vehicleType);
            if (!string.IsNullOrWhiteSpace(status))      q = q.Where(v => v.Status == status);

            var list = await q.OrderBy(v => v.Make).ThenBy(v => v.Model).ToListAsync();
            return Ok(ApiResponse<List<VehicleDto>>.Ok(_mapper.Map<List<VehicleDto>>(list)));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "GetAll Vehicles failed");
            return StatusCode(500, ApiResponse<List<VehicleDto>>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<VehicleDto>>> GetById(int id)
    {
        try
        {
            var v = await _db.Vehicles.Include(x => x.AssignedTo).FirstOrDefaultAsync(x => x.Id == id);
            return v == null
                ? NotFound(ApiResponse<VehicleDto>.Fail("Not found"))
                : Ok(ApiResponse<VehicleDto>.Ok(_mapper.Map<VehicleDto>(v)));
        }
        catch (Exception ex) { return StatusCode(500, ApiResponse<VehicleDto>.Fail(ex.Message)); }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<VehicleDto>>> Create([FromBody] CreateVehicleDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ApiResponse<VehicleDto>.Fail("Validation failed"));
            if (await _db.Vehicles.AnyAsync(v => v.LicensePlate == dto.LicensePlate))
                return Conflict(ApiResponse<VehicleDto>.Fail("License plate already exists"));

            var entity = _mapper.Map<Vehicle>(dto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Vehicles.Add(entity);
            await _db.SaveChangesAsync();

            var created = await _db.Vehicles.Include(x => x.AssignedTo).FirstAsync(x => x.Id == entity.Id);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id },
                ApiResponse<VehicleDto>.Ok(_mapper.Map<VehicleDto>(created), "Registered successfully"));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Create Vehicle failed");
            return StatusCode(500, ApiResponse<VehicleDto>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<VehicleDto>>> Update(int id, [FromBody] UpdateVehicleDto dto)
    {
        try
        {
            var entity = await _db.Vehicles.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<VehicleDto>.Fail("Not found"));
            if (await _db.Vehicles.AnyAsync(v => v.LicensePlate == dto.LicensePlate && v.Id != id))
                return Conflict(ApiResponse<VehicleDto>.Fail("License plate already in use"));
            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            var updated = await _db.Vehicles.Include(x => x.AssignedTo).FirstAsync(x => x.Id == id);
            return Ok(ApiResponse<VehicleDto>.Ok(_mapper.Map<VehicleDto>(updated), "Updated"));
        }
        catch (Exception ex) { return StatusCode(500, ApiResponse<VehicleDto>.Fail(ex.Message)); }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            var entity = await _db.Vehicles.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found"));
            _db.Vehicles.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<bool>.Ok(true, "Deleted"));
        }
        catch (Exception ex) { return StatusCode(500, ApiResponse<bool>.Fail(ex.Message)); }
    }
}
