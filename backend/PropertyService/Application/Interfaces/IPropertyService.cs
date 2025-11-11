using PropertyService.Application.Dtos;
using PropertyService.Application.Models;

namespace PropertyService.Application.Interfaces;

public interface IPropertyService
{
    Task<IReadOnlyCollection<PropertyDto>> GetAsync(PropertyQuery query, CancellationToken cancellationToken = default);

    Task<PropertyDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

