using MottaFit.Api.Models;

namespace MottaFit.Api.Core.Interfaces
{
    public interface IExercicioRepository : IRepository<Exercicio>
    {
        Task<List<Exercicio>> GetByProfessorAsync(Guid professorId);
    }
}
