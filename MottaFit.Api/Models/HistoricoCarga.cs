using Amazon.DynamoDBv2.DataModel;

namespace MottaFit.Api.Models;

[DynamoDBTable("HistoricoCargas")]
public class HistoricoCarga
{
    [DynamoDBHashKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public Guid TreinoId { get; set; }
    
    public Guid ExercicioId { get; set; }
    
    public string? Dia { get; set; }
    
    public int CargaAnterior { get; set; }
    
    public int CargaNova { get; set; }
    
    public DateTime DataAlteracao { get; set; } = DateTime.UtcNow;
    
    public Guid AlunoId { get; set; }
}