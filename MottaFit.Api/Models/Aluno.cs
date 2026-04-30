using Amazon.DynamoDBv2.DataModel;
using MottaFit.Api.Enums;

namespace MottaFit.Api.Models;

[DynamoDBTable("Alunos")]
public class Aluno
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Nome { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string SenhaHash { get; set; } = string.Empty;
    
    public Guid ProfessorId { get; set; }
    
    public string ConviteToken { get; set; } = string.Empty;
    
    public StatusConvite StatusConvite { get; set; }
    
    public decimal ValorAula { get; set; }
    
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
}