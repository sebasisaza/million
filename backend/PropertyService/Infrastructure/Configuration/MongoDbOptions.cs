namespace PropertyService.Infrastructure.Configuration;

public class MongoDbOptions
{
    public const string SectionName = "MongoDb";

    public string ConnectionString { get; init; } = "mongodb://mongo:27017";

    public string DatabaseName { get; init; } = "properties_db";

    public string CollectionName { get; init; } = "properties";
}

