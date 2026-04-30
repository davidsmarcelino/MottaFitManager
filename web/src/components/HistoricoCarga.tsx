import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { treinoService } from '../services';

interface HistoricoItem {
  id: string;
  cargaAnterior: number;
  cargaNova: number;
  dataAlteracao: string;
}

interface HistoricoCargaProps {
  treinoId: string;
  exercicioId: string;
  exercicioNome: string;
  dia?: string;
  cargaAtual: number;
}

const HistoricoCarga: React.FC<HistoricoCargaProps> = ({ 
  treinoId, 
  exercicioId, 
  exercicioNome, 
  dia, 
  cargaAtual 
}) => {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const carregarHistorico = async () => {
    if (!mostrarHistorico) return;
    
    setLoading(true);
    try {
      const data = await treinoService.obterHistoricoCarga(treinoId, exercicioId, dia);
      setHistorico(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, [mostrarHistorico]);

  const getProgressoIcon = (anterior: number, nova: number) => {
    if (nova > anterior) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (nova < anterior) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getProgressoColor = (anterior: number, nova: number) => {
    if (nova > anterior) return 'text-green-600';
    if (nova < anterior) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularProgresso = () => {
    if (historico.length === 0) return null;
    
    const primeiraAlteracao = historico[0];
    const ultimaAlteracao = historico[historico.length - 1];
    const cargaInicial = primeiraAlteracao.cargaAnterior;
    const progressoTotal = cargaAtual - cargaInicial;
    const percentual = cargaInicial > 0 ? ((progressoTotal / cargaInicial) * 100) : 0;
    
    return {
      inicial: cargaInicial,
      atual: cargaAtual,
      progresso: progressoTotal,
      percentual: percentual.toFixed(1)
    };
  };

  const progresso = calcularProgresso();

  return (
    <div className="mt-2">
      <button
        onClick={() => setMostrarHistorico(!mostrarHistorico)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <Calendar className="h-4 w-4 mr-1" />
        {mostrarHistorico ? 'Ocultar' : 'Ver'} Histórico
      </button>

      {mostrarHistorico && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">{exercicioNome} {dia && `- ${dia}`}</h4>
          
          {progresso && (
            <div className="mb-3 p-2 bg-white rounded border">
              <div className="flex justify-between items-center text-sm">
                <span>Progresso Total:</span>
                <span className={`font-medium ${getProgressoColor(progresso.inicial, progresso.atual)}`}>
                  {progresso.inicial}kg → {progresso.atual}kg
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Variação:</span>
                <span className={getProgressoColor(progresso.inicial, progresso.atual)}>
                  {progresso.progresso > 0 ? '+' : ''}{progresso.progresso}kg ({progresso.percentual}%)
                </span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : historico.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">
              Nenhuma alteração de carga registrada
            </p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {historico.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    {getProgressoIcon(item.cargaAnterior, item.cargaNova)}
                    <span className={getProgressoColor(item.cargaAnterior, item.cargaNova)}>
                      {item.cargaAnterior}kg → {item.cargaNova}kg
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatarData(item.dataAlteracao)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoricoCarga;