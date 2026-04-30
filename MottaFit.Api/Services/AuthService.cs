using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.DTOs;
using MottaFit.Api.Helpers;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class AuthService : IAuthService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IJwtService _jwtService;

    public AuthService(IDynamoDbService dynamoDbService, IJwtService jwtService)
    {
        _dynamoDbService = dynamoDbService;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse> LoginProfessorAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Senha))
            throw new ValidationException("Email e senha são obrigatórios");

        var professor = await _dynamoDbService.GetProfessorByEmailAsync(request.Email);
        
        if (professor == null || !PasswordHasher.VerifyPassword(request.Senha, professor.SenhaHash))
            throw new ForbiddenException("Email ou senha incorretos");

        if (!professor.Ativo)
            throw new ForbiddenException("Professor inativo");

        var token = _jwtService.GenerateToken(professor.Id, professor.Email, professor.Nome, "Professor");
        
        return new LoginResponse
        {
            Token = token,
            Nome = professor.Nome,
            TipoUsuario = "Professor",
            Id = professor.Id
        };
    }

    public async Task<LoginResponse> LoginAlunoAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Senha))
            throw new ValidationException("Email e senha são obrigatórios");

        var aluno = await _dynamoDbService.GetAlunoByEmailAsync(request.Email);
        
        if (aluno == null || !PasswordHasher.VerifyPassword(request.Senha, aluno.SenhaHash))
            throw new ForbiddenException("Email ou senha incorretos");

        var token = _jwtService.GenerateToken(aluno.Id, aluno.Email, aluno.Nome, "Aluno");
        
        return new LoginResponse
        {
            Token = token,
            Nome = aluno.Nome,
            TipoUsuario = "Aluno",
            Id = aluno.Id
        };
    }
}