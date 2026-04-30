using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TreinoController : ControllerBase
{
    private readonly ITreinoService _treinoService;

    public TreinoController(ITreinoService treinoService)
    {
        _treinoService = treinoService;
    }

    [HttpPost]
    public async Task<IActionResult> CriarTreino([FromBody] CriarTreinoRequest request)
    {
        var treino = await _treinoService.CriarTreinoAsync(request);
        return Ok(treino);
    }

    [HttpGet]
    public async Task<IActionResult> ListarTreinos()
    {
        var treinos = await _treinoService.ListarTreinosAsync();
        return Ok(treinos);
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<IActionResult> ListarTreinosDoAluno(Guid alunoId)
    {
        var treinos = await _treinoService.ListarTreinosDoAlunoAsync(alunoId);
        return Ok(treinos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ObterTreino(Guid id)
    {
        var treino = await _treinoService.ObterTreinoAsync(id);
        return Ok(treino);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> AtualizarTreino(Guid id, [FromBody] AtualizarTreinoRequest request)
    {
        var treino = await _treinoService.AtualizarTreinoAsync(id, request);
        return Ok(treino);
    }

    [HttpPut("{id}/carga")]
    public async Task<IActionResult> AtualizarCarga(Guid id, [FromBody] AtualizarCargaRequest request)
    {
        var treino = await _treinoService.AtualizarCargaAsync(id, request);
        return Ok(treino);
    }

    [HttpGet("{treinoId}/historico/{exercicioId}")]
    public async Task<IActionResult> ObterHistoricoCarga(Guid treinoId, Guid exercicioId, [FromQuery] string? dia = null)
    {
        var historico = await _treinoService.ObterHistoricoCargaAsync(treinoId, exercicioId, dia);
        return Ok(historico);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarTreino(Guid id)
    {
        await _treinoService.DeletarTreinoAsync(id);
        return Ok(new { message = "Treino deletado com sucesso" });
    }
}