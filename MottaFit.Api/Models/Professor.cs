using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Professores")]
public class Professor
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Nome { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string SenhaHash { get; set; } = string.Empty;
    
    public TipoLogin TipoLogin { get; set; }
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    
    public bool Ativo { get; set; } = true;
}