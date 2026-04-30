using MottaFit.Api.Core.Exceptions;
using System.Net;
using System.Text.Json;

namespace MottaFit.Api.Core.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = exception switch
        {
            ValidationException => new { message = exception.Message, statusCode = (int)HttpStatusCode.BadRequest },
            NotFoundException => new { message = exception.Message, statusCode = (int)HttpStatusCode.NotFound },
            ForbiddenException => new { message = exception.Message, statusCode = (int)HttpStatusCode.Forbidden },
            BusinessException => new { message = exception.Message, statusCode = (int)HttpStatusCode.BadRequest },
            UnauthorizedAccessException => new { message = exception.Message, statusCode = (int)HttpStatusCode.Forbidden },
            ArgumentException => new { message = exception.Message, statusCode = (int)HttpStatusCode.BadRequest },
            _ => new { message = "Erro interno do servidor", statusCode = (int)HttpStatusCode.InternalServerError }
        };

        response.StatusCode = errorResponse.statusCode;
        await response.WriteAsync(JsonSerializer.Serialize(new { message = errorResponse.message }));
    }
}