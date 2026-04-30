using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Pagamentos")]
public class Pagamento
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid AlunoId { get; set; }
    
    public Guid ProfessorId { get; set; }
    
    public int Mes { get; set; }
    
    public int Ano { get; set; }
    
    public decimal Valor { get; set; }
    
    public FormaPagamento FormaPagamento { get; set; }
    
    public DateTime DataPagamento { get; set; } = DateTime.UtcNow;
    
    public string? Observacoes { get; set; }
}