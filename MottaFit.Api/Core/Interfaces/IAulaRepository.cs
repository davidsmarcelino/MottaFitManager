using MottaFit.Api.Models;
namespace MottaFit.Api.Core.Interfaces
{
    public interface IAulaRepository : IRepository<Aula>
    {
        Task<List<Aula>> GetByProfessorAsync(Guid professorId);
    }
}
