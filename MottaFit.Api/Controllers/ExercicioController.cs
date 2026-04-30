using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ExercicioController : ControllerBase
{
    private readonly IExercicioService _exercicioService;

    public ExercicioController(IExercicioService exercicioService)
    {
        _exercicioService = exercicioService;
    }

    [HttpPost("criar")]
    public async Task<IActionResult> CriarExercicio([FromBody] CriarExercicioRequest request)
    {
        var exercicio = await _exercicioService.CriarExercicioAsync(request);
        return Ok(exercicio);
    }

    [HttpGet("listar")]
    public async Task<IActionResult> ListarExercicios()
    {
        var exercicios = await _exercicioService.ListarExerciciosAsync();
        return Ok(exercicios);
    }

    [HttpGet("buscar/{id}")]
    public async Task<IActionResult> ObterExercicio(Guid id)
    {
        var exercicio = await _exercicioService.ObterExercicioAsync(id);
        return Ok(exercicio);
    }

    [HttpPut("atualizar/{id}")]
    public async Task<IActionResult> AtualizarExercicio(Guid id, [FromBody] AtualizarExercicioRequest request)
    {
        var exercicio = await _exercicioService.AtualizarExercicioAsync(id, request);
        return Ok(exercicio);
    }

    [HttpDelete("deletar/{id}")]
    public async Task<IActionResult> DeletarExercicio(Guid id)
    {
        await _exercicioService.DeletarExercicioAsync(id);
        return Ok(new { message = "Exercício deletado com sucesso" });
    }
}