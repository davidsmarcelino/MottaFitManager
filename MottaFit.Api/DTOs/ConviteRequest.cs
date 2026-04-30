namespace MottaFit.Api.DTOs;

public class CriarConviteRequest
{
    public string NomeAluno { get; set; } = string.Empty;
    public string EmailAluno { get; set; } = string.Empty;
}

public class AceitarConviteRequest
{
    public string Token { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

public class CadastrarProfessorRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}