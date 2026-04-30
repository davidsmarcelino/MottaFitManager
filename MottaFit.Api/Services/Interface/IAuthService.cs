using MottaFit.Api.DTOs;

namespace MottaFit.Api.Services.Interface
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginProfessorAsync(LoginRequest request);
        Task<LoginResponse> LoginAlunoAsync(LoginRequest request);
    }
}
