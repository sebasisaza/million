using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using PropertyService.Domain.Entities;

namespace PropertyService.Infrastructure.HostedServices;

public class MongoDbInitializerHostedService(
    IMongoCollection<Property> collection,
    ILogger<MongoDbInitializerHostedService> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await EnsureIndexesAsync(cancellationToken);
        await SeedSampleDataAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task EnsureIndexesAsync(CancellationToken cancellationToken)
    {
        var nameIndex = new CreateIndexModel<Property>(
            Builders<Property>.IndexKeys.Ascending(p => p.Name),
            new CreateIndexOptions { Name = "idx_property_name" });

        var addressIndex = new CreateIndexModel<Property>(
            Builders<Property>.IndexKeys.Ascending(p => p.Address),
            new CreateIndexOptions { Name = "idx_property_address" });

        await collection.Indexes.CreateManyAsync([nameIndex, addressIndex], cancellationToken);
    }

    private async Task SeedSampleDataAsync(CancellationToken cancellationToken)
    {
        var count = await collection.CountDocumentsAsync(Builders<Property>.Filter.Empty, cancellationToken: cancellationToken);

        if (count > 0)
        {
            return;
        }

        logger.LogInformation("Seeding sample properties into MongoDB collection");

        var properties = new[]
        {
            new Property
            {
                Id = Guid.NewGuid(),
                IdOwner = Guid.Parse("8A5C84D3-3EE4-45FD-8E41-7ED9C5F68BE7"),
                Name = "Riverside Loft",
                Address = "101 River Ave, Portland",
                Price = 525000,
                ImageUrl = "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            },
            new Property
            {
                Id = Guid.NewGuid(),
                IdOwner = Guid.Parse("C31026B3-42AF-4D77-BD5B-5A48672278B5"),
                Name = "Sunnyvale Family Home",
                Address = "750 Oak St, Sunnyvale",
                Price = 845000,
                ImageUrl = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"
            },
            new Property
            {
                Id = Guid.NewGuid(),
                IdOwner = Guid.Parse("2F12F121-948C-4B80-B466-6C5E537C0558"),
                Name = "Downtown Condo",
                Address = "55 Market St, San Francisco",
                Price = 1200000,
                ImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
            }
        };

        await collection.InsertManyAsync(properties, cancellationToken: cancellationToken);
    }
}

