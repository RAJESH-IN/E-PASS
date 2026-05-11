using AutoMapper;
using MyPass.API.DTOs;
using MyPass.API.Models;

namespace MyPass.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Employee, EmployeeDto>();
        CreateMap<CreateEmployeeDto, Employee>()
            .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow))
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));
        CreateMap<UpdateEmployeeDto, Employee>()
            .ForMember(d => d.Id,        o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

        CreateMap<Equipment, EquipmentDto>()
            .ForMember(d => d.AssignedToName,
                o => o.MapFrom(s => s.AssignedTo != null
                    ? $"{s.AssignedTo.FirstName} {s.AssignedTo.LastName}" : null));
        CreateMap<CreateEquipmentDto, Equipment>()
            .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow))
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));
        CreateMap<UpdateEquipmentDto, Equipment>()
            .ForMember(d => d.Id,        o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

        CreateMap<Vehicle, VehicleDto>()
            .ForMember(d => d.AssignedToName,
                o => o.MapFrom(s => s.AssignedTo != null
                    ? $"{s.AssignedTo.FirstName} {s.AssignedTo.LastName}" : null));
        CreateMap<CreateVehicleDto, Vehicle>()
            .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow))
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));
        CreateMap<UpdateVehicleDto, Vehicle>()
            .ForMember(d => d.Id,        o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.UpdatedAt, o => o.MapFrom(_ => DateTime.UtcNow));
    }
}
