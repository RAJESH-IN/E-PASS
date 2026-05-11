using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPass.API.Data;
using MyPass.API.DTOs;
using MyPass.API.Models;

namespace MyPass.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly MyPassDbContext _db;
    private readonly IMapper _mapper;
    private readonly ILogger<EmployeesController> _log;

    public EmployeesController(MyPassDbContext db, IMapper mapper, ILogger<EmployeesController> log)
    { _db = db; _mapper = mapper; _log = log; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<EmployeeDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? personType, [FromQuery] string? status)
    {
        try
        {
            var q = _db.Employees.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                q = q.Where(e =>
                    e.FirstName.ToLower().Contains(s) ||
                    e.LastName.ToLower().Contains(s)  ||
                    e.Email.ToLower().Contains(s)     ||
                    (e.BadgeNumber != null && e.BadgeNumber.ToLower().Contains(s)) ||
                    (e.Department  != null && e.Department.ToLower().Contains(s))  ||
                    (e.Company     != null && e.Company.ToLower().Contains(s))     ||
                    (e.JobTitle    != null && e.JobTitle.ToLower().Contains(s)));
            }
            if (!string.IsNullOrWhiteSpace(personType)) q = q.Where(e => e.PersonType == personType);
            if (!string.IsNullOrWhiteSpace(status))     q = q.Where(e => e.Status == status);

            var list = await q.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToListAsync();
            return Ok(ApiResponse<List<EmployeeDto>>.Ok(_mapper.Map<List<EmployeeDto>>(list)));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "GetAll Employees failed");
            return StatusCode(500, ApiResponse<List<EmployeeDto>>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EmployeeDto>>> GetById(int id)
    {
        try
        {
            var e = await _db.Employees.FindAsync(id);
            return e == null
                ? NotFound(ApiResponse<EmployeeDto>.Fail("Not found"))
                : Ok(ApiResponse<EmployeeDto>.Ok(_mapper.Map<EmployeeDto>(e)));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<EmployeeDto>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EmployeeDto>>> Create([FromBody] CreateEmployeeDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ApiResponse<EmployeeDto>.Fail("Validation failed"));
            if (await _db.Employees.AnyAsync(e => e.Email == dto.Email))
                return Conflict(ApiResponse<EmployeeDto>.Fail("Email already exists"));

            var entity = _mapper.Map<Employee>(dto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _db.Employees.Add(entity);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entity.Id },
                ApiResponse<EmployeeDto>.Ok(_mapper.Map<EmployeeDto>(entity), "Registered successfully"));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Create Employee failed");
            return StatusCode(500, ApiResponse<EmployeeDto>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EmployeeDto>>> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ApiResponse<EmployeeDto>.Fail("Validation failed"));
            var entity = await _db.Employees.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<EmployeeDto>.Fail("Not found"));
            if (await _db.Employees.AnyAsync(e => e.Email == dto.Email && e.Id != id))
                return Conflict(ApiResponse<EmployeeDto>.Fail("Email already in use"));
            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<EmployeeDto>.Ok(_mapper.Map<EmployeeDto>(entity), "Updated"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<EmployeeDto>.Fail($"DB error: {ex.Message}"));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            var entity = await _db.Employees.FindAsync(id);
            if (entity == null) return NotFound(ApiResponse<bool>.Fail("Not found"));
            _db.Employees.Remove(entity);
            await _db.SaveChangesAsync();
            return Ok(ApiResponse<bool>.Ok(true, "Deleted"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.Fail($"DB error: {ex.Message}"));
        }
    }
}
