using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PropertyService.Application.Dtos;
using PropertyService.Application.Interfaces;
using PropertyService.Application.Models;

namespace PropertyService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController(IPropertyService propertyService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<PropertyDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<PropertyDto>>> Get(
        [FromQuery] string? name,
        [FromQuery] string? address,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
        {
            return BadRequest("minPrice cannot be greater than maxPrice.");
        }

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = new PropertyQuery(name, address, minPrice, maxPrice, page, pageSize);
        var result = await propertyService.GetAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PropertyDto>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await propertyService.GetByIdAsync(id, cancellationToken);

        return result is null ? NotFound() : Ok(result);
    }
}

