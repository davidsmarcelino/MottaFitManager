using MottaFit.Api.DTOs;
using MottaFit.Api.Models;

namespace MottaFit.Api.Services.Interface
{
    public interface IBioimpedanciaService
    {
        Task<Bioimpedancia> CriarBioimpedanciaAsync(CriarBioimpedanciaRequest request);
        Task<List<Bioimpedancia>> ListarBioimpedanciasAsync();
        Task<List<Bioimpedancia>> CompararBioimpedanciasAsync(Guid alunoId);
    }
}
