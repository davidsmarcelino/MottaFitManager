using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Convites")]
public class Convite
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string NomeAluno { get; set; } = string.Empty;
    
    public string EmailAluno { get; set; } = string.Empty;
    
    public string Token { get; set; } = string.Empty;
    
    public StatusConvite Status { get; set; }
    
    public Guid ProfessorId { get; set; }
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    
    public DateTime DataEnvio { get; set; } = DateTime.UtcNow;
    
    public DateTime DataExpiracao { get; set; } = DateTime.UtcNow.AddDays(7);
}