using MottaFit.Api.DTOs;
using MottaFit.Api.Models;

namespace MottaFit.Api.Services.Interface
{
    public interface IConviteService
    {
        Task<object> CriarConviteAsync(CriarConviteRequest request);
        Task<List<Convite>> ListarConvitesAsync();
        Task<object> AceitarConviteAsync(AceitarConviteRequest request);
    }
}
