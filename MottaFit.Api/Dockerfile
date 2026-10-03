FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY MottaFit.Api/MottaFit.Api.csproj MottaFit.Api/
RUN dotnet restore MottaFit.Api/MottaFit.Api.csproj
COPY MottaFit.Api/ MottaFit.Api/
RUN dotnet publish MottaFit.Api/MottaFit.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet","MottaFit.Api.dll"]
