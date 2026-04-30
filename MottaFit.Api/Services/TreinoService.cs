using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.DTOs;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class TreinoService : ITreinoService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IUserContext _userContext;

    public TreinoService(IDynamoDbService dynamoDbService, IUserContext userContext)
    {
        _dynamoDbService = dynamoDbService;
        _userContext = userContext;
    }

    public async Task<Treino> CriarTreinoAsync(CriarTreinoRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem criar treinos");

        var aluno = await _dynamoDbService.GetAlunoByIdAsync(request.AlunoId);
        if (aluno == null || aluno.ProfessorId != _userContext.UserId)
            throw new NotFoundException("Aluno não encontrado ou não pertence a este professor");

        var treino = new Treino
        {
            Nome = request.Nome,
            AlunoId = request.AlunoId,
            ProfessorId = _userContext.UserId,
            TreinoSemanal = request.TreinoSemanal
        };

        if (request.TreinoSemanal && request.ExerciciosPorDia != null)
        {
            var exerciciosPorDia = new Dictionary<string, List<ExercicioTreino>>();

            foreach (var dia in request.ExerciciosPorDia)
            {
                var exerciciosDoDia = new List<ExercicioTreino>();

                foreach (var exercicioReq in dia.Value)
                {
                    var exercicio = await _dynamoDbService.GetExercicioByIdAsync(exercicioReq.ExercicioId);
                    if (exercicio == null || exercicio.IdProfessor != _userContext.UserId)
                        throw new NotFoundException($"Exercício {exercicioReq.ExercicioId} não encontrado ou não pertence a este professor");

                    exerciciosDoDia.Add(new ExercicioTreino
                    {
                        ExercicioId = exercicio.Id,
                        Nome = exercicio.Nome,
                        Categoria = exercicio.Categoria,
                        Series = exercicioReq.Series,
                        Repeticoes = exercicioReq.Repeticoes,
                        Carga = exercicioReq.Carga,
                        VideoUrl = exercicio.VideoUrl,
                        Observacoes = exercicioReq.Observacoes
                    });
                }

                exerciciosPorDia[dia.Key] = exerciciosDoDia;
            }

            treino.ExerciciosPorDia = exerciciosPorDia;
        }
        else if (request.Exercicios != null)
        {
            var exerciciosTreino = new List<ExercicioTreino>();

            foreach (var exercicioReq in request.Exercicios)
            {
                var exercicio = await _dynamoDbService.GetExercicioByIdAsync(exercicioReq.ExercicioId);
                if (exercicio == null || exercicio.IdProfessor != _userContext.UserId)
                    throw new NotFoundException($"Exercício {exercicioReq.ExercicioId} não encontrado ou não pertence a este professor");

                exerciciosTreino.Add(new ExercicioTreino
                {
                    ExercicioId = exercicio.Id,
                    Nome = exercicio.Nome,
                    Categoria = exercicio.Categoria,
                    Series = exercicioReq.Series,
                    Repeticoes = exercicioReq.Repeticoes,
                    Carga = exercicioReq.Carga,
                    VideoUrl = exercicio.VideoUrl,
                    Observacoes = exercicioReq.Observacoes
                });
            }

            treino.Exercicios = exerciciosTreino;
        }

        return await _dynamoDbService.SaveTreinoAsync(treino);
    }

    public async Task<List<Treino>> ListarTreinosAsync()
    {
        if (_userContext.UserType == "Professor")
        {
            return await _dynamoDbService.GetTreinosByProfessorAsync(_userContext.UserId);
        }
        else if (_userContext.UserType == "Aluno")
        {
            return await _dynamoDbService.GetTreinosByAlunoAsync(_userContext.UserId);
        }
        else
        {
            throw new ForbiddenException("Tipo de usuário inválido");
        }
    }

    public async Task<List<Treino>> ListarTreinosDoAlunoAsync(Guid alunoId)
    {
        if (_userContext.UserType == "Aluno" && alunoId != _userContext.UserId)
            throw new ForbiddenException("Você só pode ver seus próprios treinos");

        if (_userContext.UserType == "Professor")
        {
            var aluno = await _dynamoDbService.GetAlunoByIdAsync(alunoId);
            if (aluno == null || aluno.ProfessorId != _userContext.UserId)
                throw new NotFoundException("Aluno não encontrado ou não pertence a este professor");
        }

        return await _dynamoDbService.GetTreinosByAlunoAsync(alunoId);
    }

    public async Task<Treino> ObterTreinoAsync(Guid id)
    {
        var treino = await _dynamoDbService.GetTreinoByIdAsync(id);
        if (treino == null)
            throw new NotFoundException("Treino não encontrado");

        if (_userContext.UserType == "Professor" && treino.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para ver este treino");
        else if (_userContext.UserType == "Aluno" && treino.AlunoId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para ver este treino");

        return treino;
    }

    public async Task<Treino> AtualizarTreinoAsync(Guid id, AtualizarTreinoRequest request)
    {
        var treino = await _dynamoDbService.GetTreinoByIdAsync(id);
        if (treino == null)
            throw new NotFoundException("Treino não encontrado");

        if (treino.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para atualizar este treino");

        treino.Nome = request.Nome;
        treino.TreinoSemanal = request.TreinoSemanal;

        return await _dynamoDbService.SaveTreinoAsync(treino);
    }

    public async Task<Treino> AtualizarCargaAsync(Guid id, AtualizarCargaRequest request)
    {
        var treino = await _dynamoDbService.GetTreinoByIdAsync(id);
        if (treino == null)
            throw new NotFoundException("Treino não encontrado");

        if (_userContext.UserType == "Aluno" && treino.AlunoId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para atualizar este treino");
        else if (_userContext.UserType == "Professor" && treino.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para atualizar este treino");

        foreach (var atualizacao in request.AtualizacoesCarga)
        {
            if (treino.TreinoSemanal && !string.IsNullOrEmpty(atualizacao.Dia))
            {
                if (treino.ExerciciosPorDia?.ContainsKey(atualizacao.Dia) == true)
                {
                    var exercicio = treino.ExerciciosPorDia[atualizacao.Dia]
                        .FirstOrDefault(e => e.ExercicioId == atualizacao.ExercicioId);
                    if (exercicio != null)
                    {
                        var cargaAnterior = exercicio.Carga;
                        exercicio.Carga = atualizacao.NovaCarga;
                        
                        if (cargaAnterior != atualizacao.NovaCarga)
                        {
                            await _dynamoDbService.SaveHistoricoCargaAsync(new HistoricoCarga
                            {
                                TreinoId = treino.Id,
                                ExercicioId = atualizacao.ExercicioId,
                                Dia = atualizacao.Dia,
                                CargaAnterior = cargaAnterior,
                                CargaNova = atualizacao.NovaCarga,
                                DataAlteracao = DateTime.UtcNow
                            });
                        }
                    }
                }
            }
            else
            {
                var exercicio = treino.Exercicios?.FirstOrDefault(e => e.ExercicioId == atualizacao.ExercicioId);
                if (exercicio != null)
                {
                    var cargaAnterior = exercicio.Carga;
                    exercicio.Carga = atualizacao.NovaCarga;
                    
                    if (cargaAnterior != atualizacao.NovaCarga)
                    {
                        await _dynamoDbService.SaveHistoricoCargaAsync(new HistoricoCarga
                        {
                            TreinoId = treino.Id,
                            ExercicioId = atualizacao.ExercicioId,
                            CargaAnterior = cargaAnterior,
                            CargaNova = atualizacao.NovaCarga,
                            DataAlteracao = DateTime.UtcNow
                        });
                    }
                }
            }
        }

        return await _dynamoDbService.SaveTreinoAsync(treino);
    }

    public async Task<List<HistoricoCarga>> ObterHistoricoCargaAsync(Guid treinoId, Guid exercicioId, string? dia = null)
    {
        var treino = await _dynamoDbService.GetTreinoByIdAsync(treinoId);
        if (treino == null)
            throw new NotFoundException("Treino não encontrado");

        if (_userContext.UserType == "Professor" && treino.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para ver este histórico");
        else if (_userContext.UserType == "Aluno" && treino.AlunoId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para ver este histórico");

        return await _dynamoDbService.GetHistoricoCargaByExercicioAsync(treinoId, exercicioId, dia);
    }

    public async Task DeletarTreinoAsync(Guid id)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem deletar treinos");

        var treino = await _dynamoDbService.GetTreinoByIdAsync(id);
        if (treino == null)
            throw new NotFoundException("Treino não encontrado");

        if (treino.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para deletar este treino");

        await _dynamoDbService.DeleteTreinoAsync(id);
    }
}