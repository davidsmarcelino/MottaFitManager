using MottaFit.Api.DTOs;
using MottaFit.Api.Models;

namespace MottaFit.Api.Services.Interface
{
    public interface ITreinoService
    {
        Task<Treino> CriarTreinoAsync(CriarTreinoRequest request);
        Task<List<Treino>> ListarTreinosAsync();
        Task<List<Treino>> ListarTreinosDoAlunoAsync(Guid alunoId);
        Task<Treino> ObterTreinoAsync(Guid id);
        Task<Treino> AtualizarTreinoAsync(Guid id, AtualizarTreinoRequest request);
        Task<Treino> AtualizarCargaAsync(Guid id, AtualizarCargaRequest request);
        Task<List<HistoricoCarga>> ObterHistoricoCargaAsync(Guid treinoId, Guid exercicioId, string? dia = null);
        Task DeletarTreinoAsync(Guid id);
    }
}
