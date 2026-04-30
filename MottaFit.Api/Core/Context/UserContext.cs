using MottaFit.Api.Core.Interfaces;
using System.Security.Claims;

namespace MottaFit.Api.Core.Context;
public class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId => Guid.Parse(_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());

    public string UserType => _httpContextAccessor.HttpContext?.User.FindFirst("UserType")?.Value ?? "";
}