using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.DTOs;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class ExercicioService : IExercicioService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IUserContext _userContext;

    public ExercicioService(IDynamoDbService dynamoDbService, IUserContext userContext)
    {
        _dynamoDbService = dynamoDbService;
        _userContext = userContext;
    }

    public async Task<Exercicio> CriarExercicioAsync(CriarExercicioRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        if (string.IsNullOrWhiteSpace(request.Nome))
            throw new ValidationException("Nome do exercício é obrigatório");

        var exercicio = new Exercicio
        {
            Nome = request.Nome,
            Categoria = request.Categoria,
            VideoUrl = request.VideoUrl,
            IdProfessor = _userContext.UserId
        };

        return await _dynamoDbService.SaveExercicioAsync(exercicio);
    }

    public async Task<List<Exercicio>> ListarExerciciosAsync()
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        return await _dynamoDbService.GetExerciciosByProfessorAsync(_userContext.UserId);
    }

    public async Task<Exercicio> ObterExercicioAsync(Guid id)
    {
        var exercicio = await _dynamoDbService.GetExercicioByIdAsync(id);
        
        if (exercicio == null)
            throw new NotFoundException("Exercício não encontrado");

        if (_userContext.UserType == "Professor" && exercicio.IdProfessor != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para ver este exercício");

        return exercicio;
    }

    public async Task<Exercicio> AtualizarExercicioAsync(Guid id, AtualizarExercicioRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        if (string.IsNullOrWhiteSpace(request.Nome))
            throw new ValidationException("Nome do exercício é obrigatório");

        var exercicio = await _dynamoDbService.GetExercicioByIdAsync(id);
        
        if (exercicio == null)
            throw new NotFoundException("Exercício não encontrado");

        if (exercicio.IdProfessor != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para atualizar este exercício");

        exercicio.Nome = request.Nome;
        exercicio.Categoria = request.Categoria;
        exercicio.VideoUrl = request.VideoUrl;

        return await _dynamoDbService.SaveExercicioAsync(exercicio);
    }

    public async Task DeletarExercicioAsync(Guid id)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        var exercicio = await _dynamoDbService.GetExercicioByIdAsync(id);
        
        if (exercicio == null)
            throw new NotFoundException("Exercício não encontrado");

        if (exercicio.IdProfessor != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para deletar este exercício");

        await _dynamoDbService.DeleteExercicioAsync(id);
    }
}