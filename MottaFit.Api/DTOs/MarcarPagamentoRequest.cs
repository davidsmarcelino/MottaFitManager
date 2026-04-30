using MottaFit.Api.Enums;

namespace MottaFit.Api.DTOs;

public class MarcarPagamentoRequest
{
    public Guid AlunoId { get; set; }
    public int Mes { get; set; }
    public int Ano { get; set; }
    public decimal Valor { get; set; }
    public FormaPagamento FormaPagamento { get; set; }
    public string? Observacoes { get; set; }
}