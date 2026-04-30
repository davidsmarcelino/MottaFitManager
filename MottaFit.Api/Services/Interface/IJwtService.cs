using System.Security.Claims;

namespace MottaFit.Api.Services.Interface
{
    public interface IJwtService
    {
        string GenerateToken(Guid userId, string email, string nome, string tipoUsuario);
        ClaimsPrincipal? ValidateToken(string token);
    }
}
