namespace PropertyService.Application.Models;

public record PropertyQuery(
    string? Name,
    string? Address,
    decimal? MinPrice,
    decimal? MaxPrice,
    int Page = 1,
    int PageSize = 20);

