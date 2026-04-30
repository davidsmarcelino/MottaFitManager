using MottaFit.Api.DTOs;
using MottaFit.Api.Models;

namespace MottaFit.Api.Services.Interface
{
    public interface IAlunoService
    {
        Task<List<Aluno>> ListarAlunosAsync();
        Task<Aluno> AtualizarValorAulaAsync(Guid alunoId, decimal valorAula);
        Task<object> GerarRelatorioFinanceiroAsync(int? mes, int? ano);
        Task MarcarPagamentoAsync(MarcarPagamentoRequest request);
    }
}
