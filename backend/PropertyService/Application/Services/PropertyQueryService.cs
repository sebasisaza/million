using System.Linq;
using PropertyService.Application.Dtos;
using PropertyService.Application.Interfaces;
using PropertyService.Application.Models;
using PropertyService.Domain.Entities;

namespace PropertyService.Application.Services;

public class PropertyQueryService(IPropertyRepository repository) : IPropertyService
{
    public async Task<IReadOnlyCollection<PropertyDto>> GetAsync(PropertyQuery query, CancellationToken cancellationToken = default)
    {
        var properties = await repository.GetAsync(query, cancellationToken);

        return properties.Select(MapToDto).ToArray();
    }

    public async Task<PropertyDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var property = await repository.GetByIdAsync(id, cancellationToken);
        return property is null ? null : MapToDto(property);
    }

    private static PropertyDto MapToDto(Property property)
    {
        return new PropertyDto(
            Id: property.Id,
            IdOwner: property.IdOwner,
            Name: property.Name,
            Address: property.Address,
            Price: property.Price,
            ImageUrl: property.ImageUrl);
    }
}

