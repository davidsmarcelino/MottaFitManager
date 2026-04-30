using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConviteController : ControllerBase
{
    private readonly IConviteService _conviteService;

    public ConviteController(IConviteService conviteService)
    {
        _conviteService = conviteService;
    }

    [HttpPost("criar")]
    public async Task<IActionResult> CriarConvite([FromBody] CriarConviteRequest request)
    {
        var result = await _conviteService.CriarConviteAsync(request);
        return Ok(result);
    }

    [HttpGet("listar")] 
    public async Task<IActionResult> ListarConvites()
    {
        var convites = await _conviteService.ListarConvitesAsync();
        return Ok(convites);
    }

    [HttpPost("aceitar")]
    [AllowAnonymous]
    public async Task<IActionResult> AceitarConvite([FromBody] AceitarConviteRequest request)
    {
        var result = await _conviteService.AceitarConviteAsync(request);
        return Ok(result);
    }
}