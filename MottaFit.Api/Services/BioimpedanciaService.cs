using MottaFit.Api.Core.Exceptions;
using MottaFit.Api.Core.Interfaces;
using MottaFit.Api.DTOs;
using MottaFit.Api.Models;
using MottaFit.Api.Services.Interface;

namespace MottaFit.Api.Services;

public class BioimpedanciaService : IBioimpedanciaService
{
    private readonly IDynamoDbService _dynamoDbService;
    private readonly IUserContext _userContext;

    public BioimpedanciaService(IDynamoDbService dynamoDbService, IUserContext userContext)
    {
        _dynamoDbService = dynamoDbService;
        _userContext = userContext;
    }

    public async Task<Bioimpedancia> CriarBioimpedanciaAsync(CriarBioimpedanciaRequest request)
    {
        if (_userContext.UserType != "Professor")
            throw new ForbiddenException("Apenas professores podem realizar esta ação");

        var aluno = await _dynamoDbService.GetAlunoByIdAsync(request.AlunoId);
        if (aluno == null)
            throw new NotFoundException("Aluno não encontrado");

        if (aluno.ProfessorId != _userContext.UserId)
            throw new ForbiddenException("Você não tem permissão para criar avaliação para este aluno");

        var resultados = CalcularComposicaoCorporal(request);

        var bioimpedancia = new Bioimpedancia
        {
            AlunoId = request.AlunoId,
            ProfessorId = _userContext.UserId,
            Idade = request.Idade,
            Altura = request.Altura,
            Peso = request.Peso,
            Sexo = request.Sexo,
            Resistencia = request.Resistencia,
            Reactancia = request.Reactancia,
            CircunferenciaBracoDireito = request.CircunferenciaBracoDireito,
            CircunferenciaBracoEsquerdo = request.CircunferenciaBracoEsquerdo,
            CircunferenciaCintura = request.CircunferenciaCintura,
            CircunferenciaQuadril = request.CircunferenciaQuadril,
            CircunferenciaCoxaDireita = request.CircunferenciaCoxaDireita,
            CircunferenciaCoxaEsquerda = request.CircunferenciaCoxaEsquerda,
            DobraSubescapular = request.DobraSubescapular,
            DobraTricipital = request.DobraTricipital,
            DobraBicipital = request.DobraBicipital,
            DobraSuprailiaca = request.DobraSuprailiaca,
            PercentualGordura = resultados.PercentualGordura,
            MassaMagra = resultados.MassaMagra,
            MassaGorda = resultados.MassaGorda,
            AguaCorporal = resultados.AguaCorporal,
            MassaMuscular = resultados.MassaMuscular,
            MassaOssea = resultados.MassaOssea,
            IMC = resultados.IMC,
            TaxaMetabolismoBasal = resultados.TaxaMetabolismoBasal,
            GorduraVisceral = resultados.GorduraVisceral,
            IdadeMetabolica = resultados.IdadeMetabolica,
            Proteina = resultados.Proteina,
            Observacoes = request.Observacoes
        };

        await _dynamoDbService.SaveBioimpedanciaAsync(bioimpedancia);
        return bioimpedancia;
    }

    public async Task<List<Bioimpedancia>> ListarBioimpedanciasAsync()
    {
        if (_userContext.UserType == "Professor")
            return await _dynamoDbService.GetBioimpedanciasByProfessorAsync(_userContext.UserId);
        else if (_userContext.UserType == "Aluno")
            return await _dynamoDbService.GetBioimpedanciasByAlunoAsync(_userContext.UserId);
        else
            throw new ForbiddenException("Tipo de usuário inválido");
    }

    public async Task<List<Bioimpedancia>> CompararBioimpedanciasAsync(Guid alunoId)
    {
        if (_userContext.UserType == "Professor")
        {
            var aluno = await _dynamoDbService.GetAlunoByIdAsync(alunoId);
            if (aluno == null)
                throw new NotFoundException("Aluno não encontrado");
            
            if (aluno.ProfessorId != _userContext.UserId)
                throw new ForbiddenException("Você não tem permissão para ver as avaliações deste aluno");
        }
        else if (_userContext.UserType == "Aluno" && alunoId != _userContext.UserId)
        {
            throw new ForbiddenException("Você só pode ver suas próprias avaliações");
        }

        var bioimpedancias = await _dynamoDbService.GetBioimpedanciasByAlunoAsync(alunoId);
        
        if (bioimpedancias.Count < 2)
            throw new ValidationException("É necessário pelo menos 2 avaliações para comparar");

        return bioimpedancias.OrderBy(b => b.DataAvaliacao).ToList();
    }

    private (decimal PercentualGordura, decimal MassaMagra, decimal MassaGorda, decimal AguaCorporal, 
             decimal MassaMuscular, decimal MassaOssea, decimal IMC, decimal TaxaMetabolismoBasal, 
             decimal GorduraVisceral, int IdadeMetabolica, decimal Proteina) CalcularComposicaoCorporal(CriarBioimpedanciaRequest request)
    {
        var imc = request.Peso / (request.Altura * request.Altura);
        var impedancia = (decimal)Math.Sqrt(Math.Pow((double)request.Resistencia, 2) + Math.Pow((double)request.Reactancia, 2));
        var alturaQuadrada = request.Altura * request.Altura;
        
        var massaMagra = request.Sexo.ToUpper() == "M" 
            ? 0.734m * (alturaQuadrada / impedancia) + 0.116m * request.Peso + 0.096m * request.Idade - 4.03m
            : 0.481m * (alturaQuadrada / impedancia) + 0.295m * request.Peso + 0.065m * request.Idade - 1.96m;
        
        massaMagra = Math.Max(0, Math.Min(massaMagra, request.Peso));
        var massaGorda = request.Peso - massaMagra;
        var percentualGordura = massaGorda / request.Peso * 100;
        var aguaCorporal = massaMagra * 0.73m;
        var massaMuscular = massaMagra * 0.85m;
        var massaOssea = request.Sexo.ToUpper() == "M" ? request.Peso * 0.15m : request.Peso * 0.12m;
        
        var tmb = request.Sexo.ToUpper() == "M"
            ? 88.362m + 13.397m * request.Peso + 4.799m * request.Altura * 100 - 5.677m * request.Idade
            : 447.593m + 9.247m * request.Peso + 3.098m * request.Altura * 100 - 4.330m * request.Idade;
        
        var gorduraVisceral = percentualGordura > 25 ? (percentualGordura - 25) / 2 : 0;
        var idadeMetabolica = (int)(request.Idade + (percentualGordura - 20) / 2);
        var proteina = massaMagra * 0.20m;

        return (percentualGordura, massaMagra, massaGorda, aguaCorporal, massaMuscular, massaOssea, imc, tmb, gorduraVisceral, idadeMetabolica, proteina);
    }
}