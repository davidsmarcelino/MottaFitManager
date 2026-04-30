using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.DTOs;
using MottaFit.Api.Enums;
using MottaFit.Api.Helpers;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class ConviteService : IConviteService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IUserContext _userContext;

    public ConviteService(IDynamoDbService dynamoDbService, IUserContext userContext)
    {
        _dynamoDbService = dynamoDbService;
        _userContext = userContext;
    }

    public async Task<object> CriarConviteAsync(CriarConviteRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem criar convites");

        if (await _dynamoDbService.EmailAlunoJaConvidadoAsync(request.EmailAluno, _userContext.UserId))
            throw new ValidationException("Aluno já possui convite pendente");

        var alunoExistente = await _dynamoDbService.GetAlunoByEmailAsync(request.EmailAluno);
        if (alunoExistente != null)
            throw new ValidationException("Aluno já está cadastrado");

        var convite = new Convite
        {
            NomeAluno = request.NomeAluno,
            EmailAluno = request.EmailAluno,
            Token = Guid.NewGuid().ToString(),
            Status = StatusConvite.Pendente,
            ProfessorId = _userContext.UserId
        };

        await _dynamoDbService.SaveConviteAsync(convite);

        return new { message = "Convite criado com sucesso", token = convite.Token };
    }

    public async Task<List<Convite>> ListarConvitesAsync()
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem listar convites");

        return await _dynamoDbService.GetConvitesByProfessorAsync(_userContext.UserId);
    }

    public async Task<object> AceitarConviteAsync(AceitarConviteRequest request)
    {
        var convite = await _dynamoDbService.GetConviteByTokenAsync(request.Token);
        
        if (convite == null)
            throw new NotFoundException("Token de convite inválido");

        if (convite.Status != StatusConvite.Pendente)
            throw new ValidationException("Convite já foi utilizado ou expirou");

        if (DateTime.UtcNow > convite.DataExpiracao)
        {
            convite.Status = StatusConvite.Expirado;
            await _dynamoDbService.SaveConviteAsync(convite);
            throw new ValidationException("Convite expirado");
        }

        var alunoExistente = await _dynamoDbService.GetAlunoByEmailAsync(convite.EmailAluno);
        if (alunoExistente != null)
            throw new ValidationException("Aluno já está cadastrado");

        var aluno = new Aluno
        {
            Nome = request.Nome,
            Email = convite.EmailAluno,
            SenhaHash = PasswordHasher.HashPassword(request.Senha),
            ProfessorId = convite.ProfessorId,
            ConviteToken = convite.Token,
            StatusConvite = StatusConvite.Aceito
        };

        await _dynamoDbService.SaveAlunoAsync(aluno);

        convite.Status = StatusConvite.Aceito;
        await _dynamoDbService.SaveConviteAsync(convite);

        return new { message = "Cadastro realizado com sucesso" };
    }
}