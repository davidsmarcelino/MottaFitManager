namespace MottaFit.Api.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

public class LoginResponse
{
    public Guid Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string TipoUsuario { get; set; } = string.Empty;
}