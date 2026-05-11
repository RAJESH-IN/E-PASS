using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPass.API.Data;
using MyPass.API.DTOs;
using MyPass.API.Models;

namespace MyPass.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly MyPassDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILogger<EquipmentController> _log;

    public EquipmentController(MyPassDbContext db, IMapper mapper, ILogger<EquipmentController> log)
    { _db = db; _mapper = mapper; _log = log; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<EquipmentDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? status)
    {
        try
        {
            var q = _db.Equipment.Include(e => e.AssignedTo).AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                q = q.Where(e =>
                    e.Name.ToLower().Contains(s)     ||
                    e.Category.ToLower().Contains(s) ||
                    (e.SerialNumber != null && e.SerialNumber.ToLower().Contains(s)) ||
                    (e.AssetTag     != null && e.AssetTag.ToLower().Contains(s))     ||
                    (e.Location     != null && e.Location.ToLower().Contains(s))     ||
                    (e.Manufacturer != null && e.Manufacturer.ToLower().Contains(s)));
            }
            if (!string.IsNullOrWhiteSpace(category)) q = q.Where(e => e.Category == category);
            if (!string.IsNullOrWhiteSpace(status))   q = q.Where(e => e.Status == status);

            var list = await q.OrderBy(e => e.Name).ToListAsync();
            return Ok(ApiResponse<List<EquipmentDto>>.Ok(_mapper.Map<List<EquipmentDto>>(list)));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "GetAll Equipment failed");
            return StatusCode(500, ApiResponse<List<EquipmentDto>>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EquipmentDto>>> GetById(int id)
    {
        try
        {
            var e = await _db.Equipment.Include(x => x.AssignedTo).FirstOrDefaultAsync(x => x.Id == id);
            return e == null
                ? NotFound(ApiResponse<EquipmentDto>.Fail("Not found"))
                : Ok(ApiResponse<EquipmentDto>.Ok(_mapper.Map<EquipmentDto>(e)));
        }
        catch (Exception ex) { return StatusCode(500, ApiResponse<EquipmentDto>.Fail(ex.Message)); }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EquipmentDto>>> Create([FromBody] CreateEquipmentDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ApiResponse<EquipmentDto>.Fail("Validation failed"));
            if (dto.SerialNumber != null && await _db.Equipment.AnyAsync(e => e.SerialNumber == dto.SerialNumber))
                return Conflict(ApiResponse<EquipmentDto>.Fail("Serial number already exists"));

            var entity = _mapper.Map<Equipment>(dto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Equipment.Add(entity);
            await _db.SaveChangesAsync();

            var created = await _db.Equipment.Include(x => x.AssignedTo).FirstAsync(x => x.Id == entity.Id);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id },
                ApiResponse<EquipmentDto>.Ok(_mapper.Map<EquipmentDto>(created), "Registered successfully"));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Create Equipment failed");
            return StatusCode(500, ApiResponse<EquipmentDto>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EquipmentDto>>> Update(int id, [FromBody] UpdateEquipmentDto dto)
    {
        try
        {
            var entity = await _db.Equipment.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<EquipmentDto>.Fail("Not found"));
            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            var updated = await _db.Equipment.Include(x => x.AssignedTo).FirstAsync(x => x.Id == id);
            return Ok(ApiResponse<EquipmentDto>.Ok(_mapper.Map<EquipmentDto>(updated), "Updated"));
        }
        catch (Exception ex) { return StatusCode(500, ApiResponse<EquipmentDto>.Fail(ex.Message)); }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            var entity = await _db.Equipment.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found"));
            _db.Equipment.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<bool>.Ok(true, "Deleted"));
        }
        catch (Exception ex) { return StatusCode(500, ApiResponse<bool>.Fail(ex.Message)); }
    }
}
