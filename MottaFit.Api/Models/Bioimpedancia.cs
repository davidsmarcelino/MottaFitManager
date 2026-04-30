using Amazon.DynamoDBv2.DataModel;

namespace MottaFit.Api.Models;

[DynamoDBTable("Bioimpedancias")]
public class Bioimpedancia
{
    [DynamoDBHashKey]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid AlunoId { get; set; }
    
    public Guid ProfessorId { get; set; }
    
    // Dados pessoais
    public int Idade { get; set; }
    public decimal Altura { get; set; }
    public decimal Peso { get; set; }
    public string Sexo { get; set; } = string.Empty;
    
    // Bioimpedância
    public decimal Resistencia { get; set; }
    public decimal Reactancia { get; set; }
    
    // Circunferências (cm)
    public decimal? CircunferenciaBracoDireito { get; set; }
    public decimal? CircunferenciaBracoEsquerdo { get; set; }
    public decimal? CircunferenciaCintura { get; set; }
    public decimal? CircunferenciaQuadril { get; set; }
    public decimal? CircunferenciaCoxaDireita { get; set; }
    public decimal? CircunferenciaCoxaEsquerda { get; set; }
    
    // Dobras cutâneas (mm)
    public decimal? DobraSubescapular { get; set; }
    public decimal? DobraTricipital { get; set; }
    public decimal? DobraBicipital { get; set; }
    public decimal? DobraSuprailiaca { get; set; }
    
    // Resultados calculados
    public decimal PercentualGordura { get; set; }
    public decimal MassaMagra { get; set; }
    public decimal MassaGorda { get; set; }
    public decimal AguaCorporal { get; set; }
    public decimal MassaMuscular { get; set; }
    public decimal MassaOssea { get; set; }
    public decimal IMC { get; set; }
    public decimal TaxaMetabolismoBasal { get; set; }
    public decimal GorduraVisceral { get; set; }
    public int IdadeMetabolica { get; set; }
    public decimal Proteina { get; set; }
    
    public DateTime DataAvaliacao { get; set; } = DateTime.UtcNow;
    
    public string? Observacoes { get; set; }
}