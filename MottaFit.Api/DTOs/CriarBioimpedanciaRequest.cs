namespace MottaFit.Api.DTOs;

public class CriarBioimpedanciaRequest
{
    public Guid AlunoId { get; set; }
    public int Idade { get; set; }
    public decimal Altura { get; set; }
    public decimal Peso { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public decimal Resistencia { get; set; }
    public decimal Reactancia { get; set; }
    public decimal? CircunferenciaBracoDireito { get; set; }
    public decimal? CircunferenciaBracoEsquerdo { get; set; }
    public decimal? CircunferenciaCintura { get; set; }
    public decimal? CircunferenciaQuadril { get; set; }
    public decimal? CircunferenciaCoxaDireita { get; set; }
    public decimal? CircunferenciaCoxaEsquerda { get; set; }
    public decimal? DobraSubescapular { get; set; }
    public decimal? DobraTricipital { get; set; }
    public decimal? DobraBicipital { get; set; }
    public decimal? DobraSuprailiaca { get; set; }
    public string? Observacoes { get; set; }
}