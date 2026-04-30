using System.Text.Json.Serialization;

namespace MottaFit.Api.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum StatusAula
    {
        Agendada,
        Realizada,
        Remarcada,
        Faltou
    }
}
