using PropertyService.Application.Models;
using PropertyService.Domain.Entities;

namespace PropertyService.Application.Interfaces;

public interface IPropertyRepository
{
    Task<IReadOnlyCollection<Property>> GetAsync(PropertyQuery query, CancellationToken cancellationToken = default);

    Task<Property?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

