using Microsoft.AspNetCore.Mvc;
using PropertyService.Application.Interfaces;
using PropertyService.Application.Services;
using PropertyService.Infrastructure.Configuration;
using PropertyService.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbOptions>(
    builder.Configuration.GetSection(MongoDbOptions.SectionName));
builder.Services.AddMongoDbInfrastructure();

builder.Services.AddScoped<IPropertyService, PropertyQueryService>();

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
            new BadRequestObjectResult(new ValidationProblemDetails(context.ModelState));
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

