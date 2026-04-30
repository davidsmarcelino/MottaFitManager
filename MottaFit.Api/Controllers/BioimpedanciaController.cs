using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BioimpedanciaController : ControllerBase
{
    private readonly IBioimpedanciaService _bioimpedanciaService;

    public BioimpedanciaController(IBioimpedanciaService bioimpedanciaService)
    {
        _bioimpedanciaService = bioimpedanciaService;
    }

    [HttpPost("criar")]
    public async Task<IActionResult> CriarBioimpedancia([FromBody] CriarBioimpedanciaRequest request)
    {
        var bioimpedancia = await _bioimpedanciaService.CriarBioimpedanciaAsync(request);
        return Ok(new { message = "Avaliação criada com sucesso", bioimpedancia });
    }

    [HttpGet("listar")]
    public async Task<IActionResult> ListarBioimpedancias()
    {
        var bioimpedancias = await _bioimpedanciaService.ListarBioimpedanciasAsync();
        return Ok(bioimpedancias);
    }

    [HttpGet("comparar/{alunoId}")]
    public async Task<IActionResult> CompararBioimpedancias(Guid alunoId)
    {
        var avaliacoes = await _bioimpedanciaService.CompararBioimpedanciasAsync(alunoId);
        return Ok(avaliacoes);
    }
}