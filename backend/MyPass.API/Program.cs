using Microsoft.EntityFrameworkCore;
using MyPass.API.Data;
using MyPass.API.Mappings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "MyPass API", Version = "v1" }));

builder.Services.AddDbContext<MyPassDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("MyPassDb"))
       .EnableDetailedErrors()
       .EnableSensitiveDataLogging());

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(p =>
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// Test DB connection at startup and log the result
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyPassDbContext>();
    try
    {
        var canConnect = await db.Database.CanConnectAsync();
        Console.WriteLine(canConnect
            ? "✅ Database connection: OK"
            : "❌ Database connection: FAILED - check connection string");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database error: {ex.Message}");
    }
}

// CORS first
app.UseCors();

// Show full exception details in dev
app.UseDeveloperExceptionPage();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyPass API v1");
    c.RoutePrefix = "swagger";
});

app.UseAuthorization();
app.MapControllers();

// Health check with DB test
app.MapGet("/health", async (MyPassDbContext db) =>
{
    try
    {
        var canConnect = await db.Database.CanConnectAsync();
        var empCount   = canConnect ? await db.Employees.CountAsync() : -1;
        return Results.Ok(new
        {
            status    = canConnect ? "healthy" : "db_error",
            employees = empCount,
            time      = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { status = "error", message = ex.Message });
    }
});

Console.WriteLine("================================================");
Console.WriteLine("  MyPass API running -> http://localhost:61877");
Console.WriteLine("  Health:  http://localhost:61877/health");
Console.WriteLine("  Swagger: http://localhost:61877/swagger");
Console.WriteLine("================================================");

app.Run();
