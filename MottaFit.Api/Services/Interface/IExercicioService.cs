using MottaFit.Api.DTOs;
using MottaFit.Api.Models;

namespace MottaFit.Api.Services.Interface
{
    public interface IExercicioService
    {
        Task<Exercicio> CriarExercicioAsync(CriarExercicioRequest request);
        Task<List<Exercicio>> ListarExerciciosAsync();
        Task<Exercicio> ObterExercicioAsync(Guid id);
        Task<Exercicio> AtualizarExercicioAsync(Guid id, AtualizarExercicioRequest request);
        Task DeletarExercicioAsync(Guid id);
    }
}
