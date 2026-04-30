using MottaFit.Api.DTOs;

namespace MottaFit.Api.Services.Interface
{
    public interface IAulaService
    {
        Task<object> CriarAulaAsync(CriarAulaRequest request);
        Task<object> ListarAulasAsync();
        Task<object> AtualizarAulaAsync(string id, AtualizarAulaRequest request);
        Task<object> AtualizarStatusAulaAsync(string id, AtualizarStatusAulaRequest request);
        Task<object> RemarcarAulaAsync(string id, RemarcarAulaRequest request);
        Task DeletarAulaAsync(string id);

    }
}
