using System.Linq;
using Moq;
using PropertyService.Application.Interfaces;
using PropertyService.Application.Models;
using PropertyService.Application.Services;
using PropertyService.Domain.Entities;
using NUnit.Framework;

namespace PropertyService.Tests.Application.Services;

public class PropertyQueryServiceTests
{
    private readonly Mock<IPropertyRepository> _repositoryMock = new();
    private readonly PropertyQueryService _sut;

    public PropertyQueryServiceTests()
    {
        _sut = new PropertyQueryService(_repositoryMock.Object);
    }

    [Test]
    public async Task GetAsync_ReturnsDtos()
    {
        // Arrange
        var query = new PropertyQuery(null, null, null, null);
        var properties = new[]
        {
            new Property
            {
                Id = Guid.NewGuid(),
                IdOwner = Guid.NewGuid(),
                Name = "Modern Loft",
                Address = "123 Main St",
                Price = 250000,
                ImageUrl = "https://example.com/property.jpg"
            }
        };

        _repositoryMock
            .Setup(r => r.GetAsync(query, It.IsAny<CancellationToken>()))
            .ReturnsAsync(properties);

        // Act
        var result = await _sut.GetAsync(query);

        // Assert
        Assert.That(result, Has.Count.EqualTo(1));
        var dto = result.Single();
        Assert.Multiple(() =>
        {
            Assert.That(dto.Id, Is.EqualTo(properties[0].Id));
            Assert.That(dto.Name, Is.EqualTo(properties[0].Name));
            Assert.That(dto.Price, Is.EqualTo(properties[0].Price));
        });
    }

    [Test]
    public async Task GetByIdAsync_WhenNotFound_ReturnsNull()
    {
        var id = Guid.NewGuid();

        _repositoryMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Property?)null);

        var result = await _sut.GetByIdAsync(id);

        Assert.That(result, Is.Null);
    }
}

