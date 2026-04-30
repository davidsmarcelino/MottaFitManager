using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using MottaFit.Api.Enums;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class DynamoDbService : IDynamoDbService
{
    private readonly DynamoDBContext _context;

    public DynamoDbService(IAmazonDynamoDB dynamoDbClient)
    {
        _context = new DynamoDBContext(dynamoDbClient);
    }

    // Professor methods
    public async Task<Professor?> GetProfessorByEmailAsync(string email)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("Email", ScanOperator.Equal, email)
        };
        var search = _context.ScanAsync<Professor>(scanConditions);
        var professors = await search.GetRemainingAsync();
        return professors.FirstOrDefault();
    }

    public async Task SaveProfessorAsync(Professor professor)
    {
        await _context.SaveAsync(professor);
    }

    // Aluno methods
    public async Task<Aluno?> GetAlunoByEmailAsync(string email)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("Email", ScanOperator.Equal, email)
        };
        var search = _context.ScanAsync<Aluno>(scanConditions);
        var alunos = await search.GetRemainingAsync();
        return alunos.FirstOrDefault();
    }

    public async Task SaveAlunoAsync(Aluno aluno)
    {
        await _context.SaveAsync(aluno);
    }

    public async Task<Aluno?> GetAlunoByIdAsync(Guid id)
    {
        return await _context.LoadAsync<Aluno>(id);
    }

    public async Task<List<Aluno>> GetAlunosByProfessorAsync(Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("ProfessorId", ScanOperator.Equal, professorId)
        };
        var search = _context.ScanAsync<Aluno>(scanConditions);
        return await search.GetRemainingAsync();
    }

    // Convite methods
    public async Task<Convite?> GetConviteByTokenAsync(string token)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("Token", ScanOperator.Equal, token)
        };
        var search = _context.ScanAsync<Convite>(scanConditions);
        var convites = await search.GetRemainingAsync();
        return convites.FirstOrDefault();
    }

    public async Task SaveConviteAsync(Convite convite)
    {
        await _context.SaveAsync(convite);
    }

    public async Task<bool> EmailAlunoJaConvidadoAsync(string email, Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("EmailAluno", ScanOperator.Equal, email),
            new("ProfessorId", ScanOperator.Equal, professorId),
            new("Status", ScanOperator.Equal, StatusConvite.Pendente)
        };
        var search = _context.ScanAsync<Convite>(scanConditions);
        var convites = await search.GetRemainingAsync();
        return convites.Any();
    }

    public async Task<List<Convite>> GetConvitesByProfessorAsync(Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("ProfessorId", ScanOperator.Equal, professorId)
        };
        var search = _context.ScanAsync<Convite>(scanConditions);
        var convites = await search.GetRemainingAsync();
        return convites.OrderByDescending(c => c.DataCriacao).ToList();
    }

    // Exercicio methods
    public async Task<Exercicio> SaveExercicioAsync(Exercicio exercicio)
    {
        await _context.SaveAsync(exercicio);
        return exercicio;
    }

    public async Task<Exercicio?> GetExercicioByIdAsync(Guid id)
    {
        return await _context.LoadAsync<Exercicio>(id);
    }

    public async Task<List<Exercicio>> GetExerciciosByProfessorAsync(Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("IdProfessor", ScanOperator.Equal, professorId)
        };
        var search = _context.ScanAsync<Exercicio>(scanConditions);
        return await search.GetRemainingAsync();
    }

    public async Task DeleteExercicioAsync(Guid id)
    {
        await _context.DeleteAsync<Exercicio>(id);
    }

    // Treino methods
    public async Task<Treino> SaveTreinoAsync(Treino treino)
    {
        await _context.SaveAsync(treino);
        return treino;
    }

    public async Task<Treino?> GetTreinoByIdAsync(Guid id)
    {
        return await _context.LoadAsync<Treino>(id);
    }

    public async Task<List<Treino>> GetTreinosByProfessorAsync(Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("ProfessorId", ScanOperator.Equal, professorId)
        };
        var search = _context.ScanAsync<Treino>(scanConditions);
        return await search.GetRemainingAsync();
    }

    public async Task<List<Treino>> GetTreinosByAlunoAsync(Guid alunoId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("AlunoId", ScanOperator.Equal, alunoId)
        };
        var search = _context.ScanAsync<Treino>(scanConditions);
        return await search.GetRemainingAsync();
    }

    public async Task DeleteTreinoAsync(Guid id)
    {
        await _context.DeleteAsync<Treino>(id);
    }

    // HistoricoCarga methods
    public async Task SaveHistoricoCargaAsync(HistoricoCarga historico)
    {
        await _context.SaveAsync(historico);
    }

    public async Task<List<HistoricoCarga>> GetHistoricoCargaByExercicioAsync(Guid treinoId, Guid exercicioId, string? dia = null)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("TreinoId", ScanOperator.Equal, treinoId),
            new("ExercicioId", ScanOperator.Equal, exercicioId)
        };
        
        if (!string.IsNullOrEmpty(dia))
        {
            scanConditions.Add(new("Dia", ScanOperator.Equal, dia));
        }
        
        var search = _context.ScanAsync<HistoricoCarga>(scanConditions);
        var historicos = await search.GetRemainingAsync();
        return historicos.OrderBy(h => h.DataAlteracao).ToList();
    }

    // Aula methods
    public async Task SaveAulaAsync(Aula aula)
    {
        await _context.SaveAsync(aula);
    }

    public async Task<Aula?> GetAulaByIdAsync(string id)
    {
        return await _context.LoadAsync<Aula>(id);
    }

    public async Task<List<Aula>> GetAulasByProfessorAsync(Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("ProfessorId", ScanOperator.Equal, professorId)
        };
        var search = _context.ScanAsync<Aula>(scanConditions);
        return await search.GetRemainingAsync();
    }

    public async Task<List<Aula>> GetAulasByAlunoAsync(Guid alunoId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("AlunoId", ScanOperator.Equal, alunoId)
        };
        var search = _context.ScanAsync<Aula>(scanConditions);
        return await search.GetRemainingAsync();
    }

    public async Task DeleteAulaAsync(string id)
    {
        await _context.DeleteAsync<Aula>(id);
    }

    public async Task<Professor?> GetProfessorByIdAsync(Guid id)
    {
        return await _context.LoadAsync<Professor>(id);
    }

    // Pagamento methods
    public async Task SavePagamentoAsync(Pagamento pagamento)
    {
        await _context.SaveAsync(pagamento);
    }

    public async Task<Pagamento?> GetPagamentoAsync(Guid alunoId, int mes, int ano)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("AlunoId", ScanOperator.Equal, alunoId),
            new("Mes", ScanOperator.Equal, mes),
            new("Ano", ScanOperator.Equal, ano)
        };
        var search = _context.ScanAsync<Pagamento>(scanConditions);
        var pagamentos = await search.GetRemainingAsync();
        return pagamentos.FirstOrDefault();
    }

    // Bioimpedancia methods
    public async Task SaveBioimpedanciaAsync(Bioimpedancia bioimpedancia)
    {
        await _context.SaveAsync(bioimpedancia);
    }

    public async Task<List<Bioimpedancia>> GetBioimpedanciasByAlunoAsync(Guid alunoId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("AlunoId", ScanOperator.Equal, alunoId)
        };
        var search = _context.ScanAsync<Bioimpedancia>(scanConditions);
        var bioimpedancias = await search.GetRemainingAsync();
        return bioimpedancias.OrderByDescending(b => b.DataAvaliacao).ToList();
    }

    public async Task<List<Bioimpedancia>> GetBioimpedanciasByProfessorAsync(Guid professorId)
    {
        var scanConditions = new List<ScanCondition>
        {
            new("ProfessorId", ScanOperator.Equal, professorId)
        };
        var search = _context.ScanAsync<Bioimpedancia>(scanConditions);
        var bioimpedancias = await search.GetRemainingAsync();
        return bioimpedancias.OrderByDescending(b => b.DataAvaliacao).ToList();
    }
}