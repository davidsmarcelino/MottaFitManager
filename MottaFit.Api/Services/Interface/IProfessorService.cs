using MottaFit.Api.DTOs;

namespace MottaFit.Api.Services.Interface
{
    public interface IProfessorService
    {
        Task<object> CadastrarProfessorAsync(CadastrarProfessorRequest request);
    }
}
