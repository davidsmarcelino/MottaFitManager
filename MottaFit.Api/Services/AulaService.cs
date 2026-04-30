using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.DTOs;
using MottaFit.Api.Enums;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class AulaService : IAulaService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IUserContext _userContext;

    public AulaService(IDynamoDbService dynamoDbService, IUserContext userContext)
    {
        _dynamoDbService = dynamoDbService;
        _userContext = userContext;
    }

    public async Task<object> CriarAulaAsync(CriarAulaRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem criar aulas");

        var aulasParaSalvar = new List<Aula>();

        var aulaOriginal = new Aula
        {
            ProfessorId = _userContext.UserId,
            AlunoId = request.AlunoId,
            DataHora = request.DataHora,
            Titulo = request.Titulo ?? "Aula",
            Observacoes = request.Observacoes,
            Recorrencia = request.Recorrencia
        };

        aulasParaSalvar.Add(aulaOriginal);

        if (request.Recorrencia != TipoRecorrencia.Nenhuma && request.DataFimRecorrencia.HasValue)
        {
            var dataAtual = request.DataHora;
            var dataFim = request.DataFimRecorrencia.Value;
            
            while (true)
            {
                dataAtual = request.Recorrencia switch
                {
                    TipoRecorrencia.Diaria => dataAtual.AddDays(1),
                    TipoRecorrencia.Semanal => dataAtual.AddDays(7),
                    TipoRecorrencia.Quinzenal => dataAtual.AddDays(14),
                    TipoRecorrencia.Mensal => dataAtual.AddMonths(1),
                    _ => dataAtual
                };

                if (dataAtual > dataFim || request.Recorrencia == TipoRecorrencia.Nenhuma) break;

                var aulaRecorrente = new Aula
                {
                    ProfessorId = _userContext.UserId,
                    AlunoId = request.AlunoId,
                    DataHora = dataAtual,
                    Titulo = request.Titulo ?? "Aula",
                    Observacoes = request.Observacoes,
                    Recorrencia = TipoRecorrencia.Nenhuma,
                    AulaOrigemId = aulaOriginal.Id
                };
                aulasParaSalvar.Add(aulaRecorrente);
            }
        }

        foreach (var aula in aulasParaSalvar)
        {
            await _dynamoDbService.SaveAulaAsync(aula);
        }

        return new { message = $"{aulasParaSalvar.Count} aula(s) agendada(s) com sucesso", aulas = aulasParaSalvar };
    }

    public async Task<object> ListarAulasAsync()
    {
        if (_userContext.UserType == "Professor")
        {
            var aulas = await _dynamoDbService.GetAulasByProfessorAsync(_userContext.UserId);
            return aulas;
        }
        else
        {
            var aulas = await _dynamoDbService.GetAulasByAlunoAsync(_userContext.UserId);
            var professor = await _dynamoDbService.GetProfessorByIdAsync(aulas.FirstOrDefault()?.ProfessorId ?? Guid.Empty);
            
            var aulasComProfessor = aulas.Select(aula => new {
                aula.Id,
                aula.ProfessorId,
                aula.AlunoId,
                aula.DataHora,
                aula.Titulo,
                aula.Observacoes,
                aula.Status,
                aula.AulaRemarcadaId,
                aula.IsAulaOriginal,
                aula.DataCriacao,
                NomeProfessor = professor?.Nome ?? "Professor"
            }).ToList();
            
            return aulasComProfessor;
        }
    }

    public async Task<object> AtualizarAulaAsync(string id, AtualizarAulaRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem atualizar aulas");

        var aula = await _dynamoDbService.GetAulaByIdAsync(id);
        if (aula == null)
            throw new NotFoundException("Aula não encontrada");

        if (aula.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para editar esta aula");

        aula.DataHora = request.DataHora;
        aula.Titulo = request.Titulo;
        aula.Observacoes = request.Observacoes;

        await _dynamoDbService.SaveAulaAsync(aula);

        return new { message = "Aula atualizada com sucesso", aula };
    }

    public async Task<object> AtualizarStatusAulaAsync(string id, AtualizarStatusAulaRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem atualizar status de aulas");

        var aula = await _dynamoDbService.GetAulaByIdAsync(id);
        if (aula == null)
            throw new NotFoundException("Aula não encontrada");

        if (aula.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para editar esta aula");

        aula.Status = request.Status;
        await _dynamoDbService.SaveAulaAsync(aula);

        return new { message = "Status da aula atualizado com sucesso", aula };
    }

    public async Task<object> RemarcarAulaAsync(string id, RemarcarAulaRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem remarcar aulas");

        var aulaOriginal = await _dynamoDbService.GetAulaByIdAsync(id);
        if (aulaOriginal == null)
            throw new NotFoundException("Aula não encontrada");

        if (aulaOriginal.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para remarcar esta aula");

        if (!string.IsNullOrEmpty(aulaOriginal.AulaRemarcadaId))
        {
            var aulaAnterior = await _dynamoDbService.GetAulaByIdAsync(aulaOriginal.AulaRemarcadaId);
            if (aulaAnterior != null)
            {
                aulaAnterior.Status = StatusAula.Remarcada;
                await _dynamoDbService.SaveAulaAsync(aulaAnterior);
            }
        }
        
        aulaOriginal.Status = StatusAula.Remarcada;
        
        var novaAula = new Aula
        {
            ProfessorId = aulaOriginal.ProfessorId,
            AlunoId = aulaOriginal.AlunoId,
            DataHora = request.NovaDataHora,
            Titulo = aulaOriginal.Titulo,
            Observacoes = request.Observacoes ?? aulaOriginal.Observacoes,
            Status = StatusAula.Agendada,
            AulaOrigemId = aulaOriginal.AulaOrigemId ?? aulaOriginal.Id,
            IsAulaOriginal = false
        };

        aulaOriginal.AulaRemarcadaId = novaAula.Id;
        
        await _dynamoDbService.SaveAulaAsync(aulaOriginal);
        await _dynamoDbService.SaveAulaAsync(novaAula);

        return new { message = "Aula remarcada com sucesso", aulaOriginal, novaAula };
    }

    public async Task DeletarAulaAsync(string id)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem deletar aulas");

        var aula = await _dynamoDbService.GetAulaByIdAsync(id);
        if (aula == null)
            throw new NotFoundException("Aula não encontrada");

        if (aula.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para deletar esta aula");

        await _dynamoDbService.DeleteAulaAsync(id);
    }
}