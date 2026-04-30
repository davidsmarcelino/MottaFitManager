using System.Text.Json.Serialization;

namespace MottaFit.Api.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CategoriaExercicio
    {
        Peito,
        Costas,
        Ombros,
        Biceps,
        Triceps,
        Pernas,
        Abdomen,
        Aerobico
    }
}
