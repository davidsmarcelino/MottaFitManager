using Microsoft.AspNetCore.Mvc;
using MottaFit.Api.DTOs;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login/professor")]
    public async Task<IActionResult> LoginProfessor([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginProfessorAsync(request);
        return Ok(response);
    }

    [HttpPost("login/aluno")]
    public async Task<IActionResult> LoginAluno([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAlunoAsync(request);
        return Ok(response);
    }
}