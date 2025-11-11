using System.Linq.Expressions;
using MongoDB.Driver;
using PropertyService.Application.Interfaces;
using PropertyService.Application.Models;
using PropertyService.Domain.Entities;

namespace PropertyService.Infrastructure.Repositories;

public class PropertyRepository(IMongoCollection<Property> collection) : IPropertyRepository
{
    public async Task<IReadOnlyCollection<Property>> GetAsync(PropertyQuery query, CancellationToken cancellationToken = default)
    {
        var filters = new List<FilterDefinition<Property>>();

        if (!string.IsNullOrWhiteSpace(query.Name))
        {
            filters.Add(Builders<Property>.Filter.Regex(
                p => p.Name, new MongoDB.Bson.BsonRegularExpression(query.Name, "i")));
        }

        if (!string.IsNullOrWhiteSpace(query.Address))
        {
            filters.Add(Builders<Property>.Filter.Regex(
                p => p.Address, new MongoDB.Bson.BsonRegularExpression(query.Address, "i")));
        }

        if (query.MinPrice.HasValue)
        {
            filters.Add(Builders<Property>.Filter.Gte(p => p.Price, query.MinPrice.Value));
        }

        if (query.MaxPrice.HasValue)
        {
            filters.Add(Builders<Property>.Filter.Lte(p => p.Price, query.MaxPrice.Value));
        }

        var filterDefinition = filters.Count switch
        {
            0 => Builders<Property>.Filter.Empty,
            1 => filters[0],
            _ => Builders<Property>.Filter.And(filters)
        };

        var skip = Math.Max((query.Page - 1) * query.PageSize, 0);
        var limit = Math.Clamp(query.PageSize, 1, 100);

        var result = await collection
            .Find(filterDefinition)
            .Skip(skip)
            .Limit(limit)
            .SortBy(p => p.Name)
            .ToListAsync(cancellationToken);

        return result;
    }

    public async Task<Property?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await collection
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }
}

