using MottaFit.Api.Enums;

namespace MottaFit.Api.DTOs;

public class CriarAulaRequest
{
    public Guid AlunoId { get; set; }
    public DateTime DataHora { get; set; }
    public string? Titulo { get; set; }
    public string? Observacoes { get; set; }
    public TipoRecorrencia Recorrencia { get; set; } = TipoRecorrencia.Nenhuma;
    public DateTime? DataFimRecorrencia { get; set; }
}

public class AtualizarAulaRequest
{
    public DateTime DataHora { get; set; }
    public string? Titulo { get; set; }
    public string? Observacoes { get; set; }
}

public class AtualizarStatusAulaRequest
{
    public StatusAula Status { get; set; }
}

public class RemarcarAulaRequest
{
    public DateTime NovaDataHora { get; set; }
    public string? Observacoes { get; set; }
}