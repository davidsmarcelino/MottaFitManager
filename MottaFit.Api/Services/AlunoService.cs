using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.DTOs;
using MottaFit.Api.Enums;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class AlunoService : IAlunoService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IUserContext _userContext;

    public AlunoService(IDynamoDbService dynamoDbService, IUserContext userContext)
    {
        _dynamoDbService = dynamoDbService;
        _userContext = userContext;
    }

    public async Task<List<Aluno>> ListarAlunosAsync()
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        return await _dynamoDbService.GetAlunosByProfessorAsync(_userContext.UserId);
    }

    public async Task<Aluno> AtualizarValorAulaAsync(Guid alunoId, decimal valorAula)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        if (valorAula <= 0)
            throw new ValidationException("Valor da aula deve ser maior que zero");

        var aluno = await _dynamoDbService.GetAlunoByIdAsync(alunoId);
        if (aluno == null)
            throw new NotFoundException("Aluno não encontrado");

        if (aluno.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para alterar este aluno");

        aluno.ValorAula = valorAula;
        await _dynamoDbService.SaveAlunoAsync(aluno);
        
        return aluno;
    }

    public async Task<object> GerarRelatorioFinanceiroAsync(int? mes, int? ano)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        var alunos = await _dynamoDbService.GetAlunosByProfessorAsync(_userContext.UserId);
        var aulas = await _dynamoDbService.GetAulasByProfessorAsync(_userContext.UserId);

        var relatorio = alunos.Select(aluno => {
            var aulasAluno = aulas.Where(a => a.AlunoId == aluno.Id);
            
            var aulasFiltradas = mes.HasValue && ano.HasValue
                ? aulasAluno.Where(a => a.DataHora.Month == mes && a.DataHora.Year == ano)
                : aulasAluno;

            var aulasRealizadas = aulasFiltradas.Count(a => a.Status == StatusAula.Realizada);
            var aulasFaltou = aulasFiltradas.Count(a => a.Status == StatusAula.Faltou);
            var aulasAgendadas = aulasFiltradas.Count(a => a.Status == StatusAula.Agendada);
            var aulasRemarcadas = aulasFiltradas.Count(a => a.Status == StatusAula.Remarcada);
            
            var totalCobrar = (aulasRealizadas + aulasFaltou) * aluno.ValorAula;
            var pagamento = _dynamoDbService.GetPagamentoAsync(aluno.Id, mes ?? DateTime.Now.Month, ano ?? DateTime.Now.Year).Result;
            var valorPago = pagamento?.Valor ?? 0;
            var valorPendente = totalCobrar - valorPago;

            return new {
                aluno.Id,
                aluno.Nome,
                aluno.ValorAula,
                AulasRealizadas = aulasRealizadas,
                AulasFaltou = aulasFaltou,
                AulasAgendadas = aulasAgendadas,
                AulasRemarcadas = aulasRemarcadas,
                TotalAulas = aulasRealizadas + aulasFaltou,
                TotalCobrar = totalCobrar,
                ValorPago = valorPago,
                ValorPendente = valorPendente,
                JaPagou = pagamento != null,
                pagamento?.FormaPagamento,
                pagamento?.DataPagamento
            };
        }).ToList();

        return relatorio;
    }

    public async Task MarcarPagamentoAsync(MarcarPagamentoRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        if (request.Valor <= 0)
            throw new ValidationException("Valor do pagamento deve ser maior que zero");

        var aluno = await _dynamoDbService.GetAlunoByIdAsync(request.AlunoId);
        if (aluno == null)
            throw new NotFoundException("Aluno não encontrado");

        if (aluno.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para alterar este aluno");

        var pagamentoExistente = await _dynamoDbService.GetPagamentoAsync(request.AlunoId, request.Mes, request.Ano);
        
        if (pagamentoExistente != null)
        {
            pagamentoExistente.Valor += request.Valor;
            pagamentoExistente.FormaPagamento = request.FormaPagamento;
            pagamentoExistente.Observacoes = request.Observacoes;
            pagamentoExistente.DataPagamento = DateTime.UtcNow;
            await _dynamoDbService.SavePagamentoAsync(pagamentoExistente);
        }
        else
        {
            var pagamento = new Pagamento
            {
                AlunoId = request.AlunoId,
                ProfessorId = _userContext.UserId,
                Mes = request.Mes,
                Ano = request.Ano,
                Valor = request.Valor,
                FormaPagamento = request.FormaPagamento,
                Observacoes = request.Observacoes
            };
            await _dynamoDbService.SavePagamentoAsync(pagamento);
        }
    }
}