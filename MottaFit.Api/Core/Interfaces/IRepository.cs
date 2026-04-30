namespace MottaFit.Api.Core.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T> SaveAsync(T entity);
    Task<T?> GetByIdAsync(Guid id);
    Task DeleteAsync(Guid id);
}
