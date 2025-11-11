using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PropertyService.Application.Interfaces;
using PropertyService.Infrastructure.Configuration;
using PropertyService.Infrastructure.HostedServices;
using PropertyService.Infrastructure.Repositories;

namespace PropertyService.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMongoDbInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IMongoClient>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<MongoDbOptions>>().Value;
            return new MongoClient(options.ConnectionString);
        });

        services.AddScoped(sp =>
        {
            var options = sp.GetRequiredService<IOptions<MongoDbOptions>>().Value;
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(options.DatabaseName);
        });

        services.AddScoped(sp =>
        {
            var options = sp.GetRequiredService<IOptions<MongoDbOptions>>().Value;
            var database = sp.GetRequiredService<IMongoDatabase>();
            return database.GetCollection<Domain.Entities.Property>(options.CollectionName);
        });

        services.AddScoped<IPropertyRepository, PropertyRepository>();
        services.AddHostedService<MongoDbInitializerHostedService>();

        return services;
    }
}

