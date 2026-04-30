using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AulaController : ControllerBase
{
    private readonly IAulaService _aulaService;

    public AulaController(IAulaService aulaService)
    {
        _aulaService = aulaService;
    }

    [HttpPost("criar")]
    public async Task<IActionResult> CriarAula([FromBody] CriarAulaRequest request)
    {
        var result = await _aulaService.CriarAulaAsync(request);
        return Ok(result);
    }

    [HttpGet("listar")]
    public async Task<IActionResult> ListarAulas()
    {
        var aulas = await _aulaService.ListarAulasAsync();
        return Ok(aulas);
    }

    [HttpPut("atualizar/{id}")]
    public async Task<IActionResult> AtualizarAula(string id, [FromBody] AtualizarAulaRequest request)
    {
        var result = await _aulaService.AtualizarAulaAsync(id, request);
        return Ok(result);
    }

    [HttpPut("status/{id}")]
    public async Task<IActionResult> AtualizarStatusAula(string id, [FromBody] AtualizarStatusAulaRequest request)
    {
        var result = await _aulaService.AtualizarStatusAulaAsync(id, request);
        return Ok(result);
    }

    [HttpPost("remarcar/{id}")]
    public async Task<IActionResult> RemarcarAula(string id, [FromBody] RemarcarAulaRequest request)
    {
        var result = await _aulaService.RemarcarAulaAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("deletar/{id}")]
    public async Task<IActionResult> DeletarAula(string id)
    {
        await _aulaService.DeletarAulaAsync(id);
        return Ok(new { message = "Aula deletada com sucesso" });
    }
}