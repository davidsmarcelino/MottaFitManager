namespace MottaFit.Api.DTOs;

public class CriarTreinoRequest
{
    public string Nome { get; set; } = string.Empty;
    public Guid AlunoId { get; set; }
    public bool TreinoSemanal { get; set; } = false;
    public List<ExercicioTreinoRequest>? Exercicios { get; set; }
    public Dictionary<string, List<ExercicioTreinoRequest>>? ExerciciosPorDia { get; set; }
}

public class ExercicioTreinoRequest
{
    public Guid ExercicioId { get; set; }
    public int Series { get; set; }
    public int Repeticoes { get; set; }
    public int Carga { get; set; }
    public string? Observacoes { get; set; }
}

public class AtualizarTreinoRequest
{
    public string Nome { get; set; } = string.Empty;
    public bool TreinoSemanal { get; set; } = false;
    public List<ExercicioTreinoRequest>? Exercicios { get; set; }
    public Dictionary<string, List<ExercicioTreinoRequest>>? ExerciciosPorDia { get; set; }
}

public class AtualizarCargaRequest
{
    public List<AtualizacaoCarga> AtualizacoesCarga { get; set; } = new();
}

public class AtualizacaoCarga
{
    public Guid ExercicioId { get; set; }
    public string? Dia { get; set; }
    public int NovaCarga { get; set; }
}