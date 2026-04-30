using MottaFit.Api.Models;

namespace MottaFit.Api.Core.Interfaces
{
    public interface IBioimpedanciaRepository : IRepository<Bioimpedancia>
    {
        Task<List<Bioimpedancia>> GetByProfessorAsync(Guid professorId);
        Task<List<Bioimpedancia>> GetByAlunoAsync(Guid alunoId);
    }
}
