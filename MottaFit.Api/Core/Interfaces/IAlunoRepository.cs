using MottaFit.Api.Models;

namespace MottaFit.Api.Core.Interfaces
{
    public interface IAlunoRepository : IRepository<Aluno>
    {
        Task<List<Aluno>> GetByProfessorAsync(Guid professorId);
    }
}
