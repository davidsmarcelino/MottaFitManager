using MottaFit.Api.Models;

namespace MottaFit.Api.Services.Interface
{
    public interface IDynamoDbService
    {
        //Professor methods
        Task<Professor?> GetProfessorByEmailAsync(string email);
        Task SaveProfessorAsync(Professor professor);

        // Aluno methods
        Task<Aluno?> GetAlunoByEmailAsync(string email);
        Task SaveAlunoAsync(Aluno aluno);
        Task<Aluno?> GetAlunoByIdAsync(Guid id);
        Task<List<Aluno>> GetAlunosByProfessorAsync(Guid professorId);

        // Convite methods
        Task<Convite?> GetConviteByTokenAsync(string token);
        Task SaveConviteAsync(Convite convite);
        Task<bool> EmailAlunoJaConvidadoAsync(string email, Guid professorId);
        Task<List<Convite>> GetConvitesByProfessorAsync(Guid professorId);

        // Exercicio methods
        Task<Exercicio> SaveExercicioAsync(Exercicio exercicio);
        Task<Exercicio?> GetExercicioByIdAsync(Guid id);
        Task<List<Exercicio>> GetExerciciosByProfessorAsync(Guid professorId);
        Task DeleteExercicioAsync(Guid id);

        // Treino methods
        Task<Treino> SaveTreinoAsync(Treino treino);
        Task<Treino?> GetTreinoByIdAsync(Guid id);
        Task<List<Treino>> GetTreinosByProfessorAsync(Guid professorId);
        Task<List<Treino>> GetTreinosByAlunoAsync(Guid alunoId);
        Task DeleteTreinoAsync(Guid id);

        // HistoricoCarga methods
        Task SaveHistoricoCargaAsync(HistoricoCarga historico);
        Task<List<HistoricoCarga>> GetHistoricoCargaByExercicioAsync(Guid treinoId, Guid exercicioId, string? dia = null);

        // Aula methods
        Task SaveAulaAsync(Aula aula);
        Task<Aula?> GetAulaByIdAsync(string id);
        Task<List<Aula>> GetAulasByProfessorAsync(Guid professorId);
        Task<List<Aula>> GetAulasByAlunoAsync(Guid alunoId);
        Task DeleteAulaAsync(string id);
        Task<Professor?> GetProfessorByIdAsync(Guid id);

        // Pagamento methods
        Task SavePagamentoAsync(Pagamento pagamento);
        Task<Pagamento?> GetPagamentoAsync(Guid alunoId, int mes, int ano);

        // Bioimpedancia methods
        Task SaveBioimpedanciaAsync(Bioimpedancia bioimpedancia);
        Task<List<Bioimpedancia>> GetBioimpedanciasByAlunoAsync(Guid alunoId);
        Task<List<Bioimpedancia>> GetBioimpedanciasByProfessorAsync(Guid professorId);



    }
}
