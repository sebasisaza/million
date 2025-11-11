using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PropertyService.Domain.Entities;

public class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public Guid Id { get; set; }

    [BsonRepresentation(BsonType.String)]
    public Guid IdOwner { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
}

