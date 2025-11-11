namespace PropertyService.Application.Dtos;

public record PropertyDto(
    Guid Id,
    Guid IdOwner,
    string Name,
    string Address,
    decimal Price,
    string ImageUrl);

