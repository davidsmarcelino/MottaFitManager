using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfessorController : ControllerBase
{
    private readonly IProfessorService _professorService;

    public ProfessorController(IProfessorService professorService)
    {
        _professorService = professorService;
    }

    [HttpPost("cadastrar")]
    public async Task<IActionResult> CadastrarProfessor([FromBody] CadastrarProfessorRequest request)
    {
        var result = await _professorService.CadastrarProfessorAsync(request);
        return Ok(result);
    }
}