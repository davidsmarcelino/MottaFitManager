using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.DTOs;
using MottaFit.Api.Helpers;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class ProfessorService : IProfessorService
{
    private readonly IDynamoDbService _dynamoDbService;

    public ProfessorService(IDynamoDbService dynamoDbService)
    {
        _dynamoDbService = dynamoDbService;
    }

    public async Task<object> CadastrarProfessorAsync(CadastrarProfessorRequest request)
    {
        var professorExistente = await _dynamoDbService.GetProfessorByEmailAsync(request.Email);
        if (professorExistente != null)
            throw new ValidationException("Email já está em uso");

        var professor = new Professor
        {
            Nome = request.Nome,
            Email = request.Email,
            SenhaHash = PasswordHasher.HashPassword(request.Senha)
        };

        await _dynamoDbService.SaveProfessorAsync(professor);

        return new { 
            message = "Professor cadastrado com sucesso",
            id = professor.Id,
            nome = professor.Nome,
            email = professor.Email
        };
    }
}