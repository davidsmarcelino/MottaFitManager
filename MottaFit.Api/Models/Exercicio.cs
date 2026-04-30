using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Exercicios")]
public class Exercicio
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Nome { get; set; } = string.Empty;
    
    public CategoriaExercicio Categoria { get; set; }

    public string? VideoUrl { get; set; }
    
    public Guid IdProfessor { get; set; }
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}