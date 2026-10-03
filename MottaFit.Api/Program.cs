using Amazon.DynamoDBv2;
using Amazon.Runtime;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MottaFit.Api.Core.Context;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.Core.Middleware;
using MottaFit.Api.Services;
using MottaFit.Api.Services.Interface;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

var jwtKey = builder.Configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY");
if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
    throw new InvalidOperationException("JWT_KEY must be configured with at least 32 characters.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "MottaFit.Api",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "MottaFit.Client",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddSingleton<IAmazonDynamoDB>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var serviceUrl = configuration["DynamoDB:ServiceUrl"] ?? Environment.GetEnvironmentVariable("DYNAMODB_SERVICE_URL");

    if (!string.IsNullOrWhiteSpace(serviceUrl))
    {
        var localConfig = new AmazonDynamoDBConfig { ServiceURL = serviceUrl, UseHttp = serviceUrl.StartsWith("http://") };
        return new AmazonDynamoDBClient(new BasicAWSCredentials("local", "local"), localConfig);
    }

    if (builder.Environment.IsDevelopment())
    {
        var accessKey = configuration["AWS:AccessKey"];
        var secretKey = configuration["AWS:SecretKey"];
        if (!string.IsNullOrEmpty(accessKey) && !string.IsNullOrEmpty(secretKey))
            return new AmazonDynamoDBClient(new BasicAWSCredentials(accessKey, secretKey), Amazon.RegionEndpoint.SAEast1);
    }

    return new AmazonDynamoDBClient(Amazon.RegionEndpoint.SAEast1);
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContext, UserContext>();
builder.Services.AddScoped<IDynamoDbService, DynamoDbService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAlunoService, AlunoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAulaService, AulaService>();
builder.Services.AddScoped<IBioimpedanciaService, BioimpedanciaService>();
builder.Services.AddScoped<IConviteService, ConviteService>();
builder.Services.AddScoped<IExercicioService, ExercicioService>();
builder.Services.AddScoped<IProfessorService, ProfessorService>();
builder.Services.AddScoped<ITreinoService, TreinoService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MottaFit API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization", In = ParameterLocation.Header, Type = SecuritySchemeType.ApiKey, Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() }
    });
});

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
