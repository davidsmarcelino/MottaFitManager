using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Aulas")]
public class Aula
{
    [DynamoDBHashKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [DynamoDBProperty]
    public Guid ProfessorId { get; set; }

    [DynamoDBProperty]
    public Guid AlunoId { get; set; }

    [DynamoDBProperty]
    public DateTime DataHora { get; set; }

    [DynamoDBProperty]
    public string? Titulo { get; set; }

    [DynamoDBProperty]
    public string? Observacoes { get; set; }

    [DynamoDBProperty]
    public StatusAula Status { get; set; } = StatusAula.Agendada;

    [DynamoDBProperty]
    public TipoRecorrencia Recorrencia { get; set; } = TipoRecorrencia.Nenhuma;

    [DynamoDBProperty]
    public DateTime? DataFimRecorrencia { get; set; }

    [DynamoDBProperty]
    public string? AulaOrigemId { get; set; }

    [DynamoDBProperty]
    public string? AulaRemarcadaId { get; set; }

    [DynamoDBProperty]
    public bool IsAulaOriginal { get; set; } = true;

    [DynamoDBProperty]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}