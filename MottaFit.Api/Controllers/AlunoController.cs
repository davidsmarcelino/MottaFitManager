using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AlunoController : ControllerBase
{
    private readonly IAlunoService _alunoService;

    public AlunoController(IAlunoService alunoService)
    {
        _alunoService = alunoService;
    }

    [HttpGet("listar")]
    public async Task<IActionResult> ListarAlunos()
    {
        var alunos = await _alunoService.ListarAlunosAsync();
        return Ok(alunos);
    }

    [HttpPut("valor-aula/{id}")]
    public async Task<IActionResult> AtualizarValorAula(Guid id, [FromBody] decimal valorAula)
    {
        var aluno = await _alunoService.AtualizarValorAulaAsync(id, valorAula);
        return Ok(new { message = "Valor da aula atualizado com sucesso", aluno });
    }

    [HttpGet("relatorio-financeiro")]
    public async Task<IActionResult> RelatorioFinanceiro([FromQuery] int? mes, [FromQuery] int? ano)
    {
        var relatorio = await _alunoService.GerarRelatorioFinanceiroAsync(mes, ano);
        return Ok(relatorio);
    }

    [HttpPost("marcar-pagamento")]
    public async Task<IActionResult> MarcarPagamento([FromBody] MarcarPagamentoRequest request)
    {
        await _alunoService.MarcarPagamentoAsync(request);
        return Ok(new { message = "Pagamento marcado com sucesso" });
    }
}