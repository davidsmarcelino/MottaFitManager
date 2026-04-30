using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Treinos")]
public class Treino
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Nome { get; set; } = string.Empty;
    
    public Guid AlunoId { get; set; }
    
    public Guid ProfessorId { get; set; }
    
    public List<ExercicioTreino> Exercicios { get; set; } = new();
    
    public Dictionary<string, List<ExercicioTreino>> ExerciciosPorDia { get; set; } = new();
    
    public bool TreinoSemanal { get; set; } = false;
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}

public class ExercicioTreino
{
    public Guid ExercicioId { get; set; }
    
    public string Nome { get; set; } = string.Empty;
    
    public CategoriaExercicio Categoria { get; set; }
    
    public int Series { get; set; }
    
    public int Repeticoes { get; set; }
    
    public int Carga { get; set; }
    
    public string? VideoUrl { get; set; }
    
    public string? Observacoes { get; set; }
}