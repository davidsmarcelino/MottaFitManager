namespace MottaFit.Api.Core.Interfaces
{
    public interface IUserContext
    {
        Guid UserId { get; }
        string UserType { get; }
    }
}
