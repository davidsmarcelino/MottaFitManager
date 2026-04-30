using MottaFit.Api.Enums;

namespace MottaFit.Api.DTOs;

public class CriarExercicioRequest
{
    public string Nome { get; set; } = string.Empty;
    public CategoriaExercicio Categoria { get; set; }
    public string? VideoUrl { get; set; }
}

public class AtualizarExercicioRequest
{
    public string Nome { get; set; } = string.Empty;
    public CategoriaExercicio Categoria { get; set; }
    public string? VideoUrl { get; set; }
}