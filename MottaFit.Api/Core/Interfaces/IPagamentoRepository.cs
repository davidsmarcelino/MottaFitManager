using MottaFit.Api.Models;

namespace MottaFit.Api.Core.Interfaces
{
    public interface IPagamentoRepository : IRepository<Pagamento>
    {
        Task<Pagamento?> GetByAlunoMesAnoAsync(Guid alunoId, int mes, int ano);
    }
}
