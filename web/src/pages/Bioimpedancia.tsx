import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Activity, User, Calendar } from 'lucide-react';
import { bioimpedanciaService, alunoService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Bioimpedancia: React.FC = () => {
  const [bioimpedancias, setBioimpedancias] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [criandoAvaliacao, setCriandoAvaliacao] = useState(false);
  const [filtroAluno, setFiltroAluno] = useState('');
  const [avaliacaoDetalhes, setAvaliacaoDetalhes] = useState<any>(null);
  const [comparacao, setComparacao] = useState<any>(null);
  const [alunosExpandidos, setAlunosExpandidos] = useState<Set<string>>(new Set());
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    alunoId: '',
    idade: '',
    altura: '',
    peso: '',
    sexo: 'M',
    resistencia: '',
    reactancia: '',
    circunferenciaBracoDireito: '',
    circunferenciaBracoEsquerdo: '',
    circunferenciaCintura: '',
    circunferenciaQuadril: '',
    circunferenciaCoxaDireita: '',
    circunferenciaCoxaEsquerda: '',
    dobraSubescapular: '',
    dobraTricipital: '',
    dobraBicipital: '',
    dobraSuprailiaca: '',
    observacoes: ''
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const carregarDados = useCallback(async () => {
    try {
      const [bioimpedanciasData, alunosData] = await Promise.all([
        bioimpedanciaService.listar(),
        user?.tipoUsuario === 'Professor' ? alunoService.listar() : Promise.resolve([])
      ]);
      setBioimpedancias(bioimpedanciasData);
      setAlunos(alunosData);
    } catch (err: any) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user, carregarDados]);

  const criarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const avaliacaoData = {
        alunoId: novaAvaliacao.alunoId,
        idade: parseInt(novaAvaliacao.idade),
        altura: parseFloat(novaAvaliacao.altura),
        peso: parseFloat(novaAvaliacao.peso),
        sexo: novaAvaliacao.sexo,
        resistencia: parseFloat(novaAvaliacao.resistencia),
        reactancia: parseFloat(novaAvaliacao.reactancia),
        circunferenciaBracoDireito: novaAvaliacao.circunferenciaBracoDireito ? parseFloat(novaAvaliacao.circunferenciaBracoDireito) : null,
        circunferenciaBracoEsquerdo: novaAvaliacao.circunferenciaBracoEsquerdo ? parseFloat(novaAvaliacao.circunferenciaBracoEsquerdo) : null,
        circunferenciaCintura: novaAvaliacao.circunferenciaCintura ? parseFloat(novaAvaliacao.circunferenciaCintura) : null,
        circunferenciaQuadril: novaAvaliacao.circunferenciaQuadril ? parseFloat(novaAvaliacao.circunferenciaQuadril) : null,
        circunferenciaCoxaDireita: novaAvaliacao.circunferenciaCoxaDireita ? parseFloat(novaAvaliacao.circunferenciaCoxaDireita) : null,
        circunferenciaCoxaEsquerda: novaAvaliacao.circunferenciaCoxaEsquerda ? parseFloat(novaAvaliacao.circunferenciaCoxaEsquerda) : null,
        dobraSubescapular: novaAvaliacao.dobraSubescapular ? parseFloat(novaAvaliacao.dobraSubescapular) : null,
        dobraTricipital: novaAvaliacao.dobraTricipital ? parseFloat(novaAvaliacao.dobraTricipital) : null,
        dobraBicipital: novaAvaliacao.dobraBicipital ? parseFloat(novaAvaliacao.dobraBicipital) : null,
        dobraSuprailiaca: novaAvaliacao.dobraSuprailiaca ? parseFloat(novaAvaliacao.dobraSuprailiaca) : null,
        observacoes: novaAvaliacao.observacoes || null
      };

      await bioimpedanciaService.criar(avaliacaoData);
      setSuccess('Avaliação criada com sucesso!');
      setCriandoAvaliacao(false);
      setNovaAvaliacao({
        alunoId: '', idade: '', altura: '', peso: '', sexo: 'M', resistencia: '', reactancia: '',
        circunferenciaBracoDireito: '', circunferenciaBracoEsquerdo: '', circunferenciaCintura: '', circunferenciaQuadril: '',
        circunferenciaCoxaDireita: '', circunferenciaCoxaEsquerda: '', dobraSubescapular: '', dobraTricipital: '',
        dobraBicipital: '', dobraSuprailiaca: '', observacoes: ''
      });
      carregarDados();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar avaliação');
    }
  };

  const getNomeAluno = (alunoId: string) => {
    const aluno = alunos.find(a => a.id === alunoId);
    return aluno ? aluno.nome : 'Aluno não encontrado';
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const compararAvaliacoes = async (alunoId: string) => {
    try {
      const response = await bioimpedanciaService.comparar(alunoId);
      if (response.length < 2) {
        setError('É necessário pelo menos 2 avaliações para comparar');
        return;
      }
      setComparacao({ avaliacoes: Array.isArray(response) ? response : [], avaliacaoSelecionada1: null, avaliacaoSelecionada2: null });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar avaliações');
    }
  };

  const compararDuasAvaliacoes = (avaliacao1: any, avaliacao2: any) => {
    const resultado = {
      DataAnterior: avaliacao1.dataAvaliacao,
      DataAtual: avaliacao2.dataAvaliacao,
      Peso: { Anterior: avaliacao1.peso, Atual: avaliacao2.peso, Diferenca: avaliacao2.peso - avaliacao1.peso },
      IMC: { Anterior: avaliacao1.imc, Atual: avaliacao2.imc, Diferenca: avaliacao2.imc - avaliacao1.imc },
      PercentualGordura: { Anterior: avaliacao1.percentualGordura, Atual: avaliacao2.percentualGordura, Diferenca: avaliacao2.percentualGordura - avaliacao1.percentualGordura },
      MassaMagra: { Anterior: avaliacao1.massaMagra, Atual: avaliacao2.massaMagra, Diferenca: avaliacao2.massaMagra - avaliacao1.massaMagra },
      MassaMuscular: { Anterior: avaliacao1.massaMuscular, Atual: avaliacao2.massaMuscular, Diferenca: avaliacao2.massaMuscular - avaliacao1.massaMuscular },
      TaxaMetabolismoBasal: { Anterior: avaliacao1.taxaMetabolismoBasal, Atual: avaliacao2.taxaMetabolismoBasal, Diferenca: avaliacao2.taxaMetabolismoBasal - avaliacao1.taxaMetabolismoBasal },
      IdadeMetabolica: { Anterior: avaliacao1.idadeMetabolica, Atual: avaliacao2.idadeMetabolica, Diferenca: avaliacao2.idadeMetabolica - avaliacao1.idadeMetabolica }
    };
    setComparacao({ ...comparacao, resultadoComparacao: resultado });
  };

  const getIndicadorTendencia = (diferenca: number, melhoriaPositiva: boolean = true) => {
    if (Math.abs(diferenca) < 0.1) return { icon: '→', color: 'text-gray-500', texto: 'Manteve' };
    const melhorou = melhoriaPositiva ? diferenca > 0 : diferenca < 0;
    return melhorou 
      ? { icon: '↑', color: 'text-green-600', texto: 'Melhorou' }
      : { icon: '↓', color: 'text-red-600', texto: 'Piorou' };
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando avaliações...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bioimpedância</h1>
          </div>
          
          {user?.tipoUsuario === 'Professor' && (
            <button
              onClick={() => setCriandoAvaliacao(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Avaliação
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Filtro de Alunos */}
        {user?.tipoUsuario === 'Professor' && (
          <div className="card mb-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filtrar aluno:</label>
              <input
                type="text"
                placeholder="Digite o nome do aluno..."
                value={filtroAluno}
                onChange={(e) => setFiltroAluno(e.target.value)}
                className="input-field flex-1 max-w-md"
              />
            </div>
          </div>
        )}

        {/* Lista de Avaliações */}
        <div className="space-y-4">
          {bioimpedancias.length === 0 ? (
            <div className="card text-center py-8">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Nenhuma avaliação encontrada.</p>
              {user?.tipoUsuario === 'Professor' && (
                <button
                  onClick={() => setCriandoAvaliacao(true)}
                  className="btn-primary"
                >
                  Criar Primeira Avaliação
                </button>
              )}
            </div>
          ) : (
            user?.tipoUsuario === 'Professor' ? (
              // Visão Professor: Agrupado por aluno
              Object.entries(
                bioimpedancias
                  .filter(avaliacao => getNomeAluno(avaliacao.alunoId).toLowerCase().includes(filtroAluno.toLowerCase()))
                  .reduce((grupos: any, avaliacao) => {
                    const alunoId = avaliacao.alunoId;
                    if (!grupos[alunoId]) grupos[alunoId] = [];
                    grupos[alunoId].push(avaliacao);
                    return grupos;
                  }, {})
              ).map(([alunoId, avaliacoes]: [string, any]) => {
                const isExpandido = alunosExpandidos.has(alunoId);
                const toggleExpansao = () => {
                  const newSet = new Set(alunosExpandidos);
                  if (isExpandido) {
                    newSet.delete(alunoId);
                  } else {
                    newSet.add(alunoId);
                  }
                  setAlunosExpandidos(newSet);
                };
                
                return (
                  <div key={alunoId} className="card">
                    <div 
                      className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50"
                      onClick={toggleExpansao}
                    >
                      <div className="flex items-center">
                        <User className="h-6 w-6 text-primary-600 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{getNomeAluno(alunoId)}</h3>
                          <p className="text-sm text-gray-600">{avaliacoes.length} avaliações</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            compararAvaliacoes(alunoId);
                          }}
                          className="btn-secondary text-xs px-2 py-1"
                          disabled={avaliacoes.length < 2}
                        >
                          Comparar
                        </button>
                        <span className="text-gray-400">
                          {isExpandido ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    
                    {isExpandido && (
                      <div className="border-t space-y-4 p-4">
                        {avaliacoes.map((avaliacao: any) => (
                          <div key={avaliacao.id} className="border rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm text-gray-600 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatarData(avaliacao.dataAvaliacao)}
                              </p>
                              <button
                                onClick={() => setAvaliacaoDetalhes(avaliacao)}
                                className="btn-primary text-xs px-2 py-1"
                              >
                                Detalhes
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="text-sm font-bold text-blue-600">{avaliacao.imc?.toFixed(1)}</div>
                                <div className="text-xs text-gray-600">IMC</div>
                              </div>
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="text-sm font-bold text-green-600">{avaliacao.percentualGordura?.toFixed(1)}%</div>
                                <div className="text-xs text-gray-600">% Gordura</div>
                              </div>
                              <div className="text-center p-2 bg-purple-50 rounded">
                                <div className="text-sm font-bold text-purple-600">{avaliacao.massaMagra?.toFixed(1)}kg</div>
                                <div className="text-xs text-gray-600">Massa Magra</div>
                              </div>
                              <div className="text-center p-2 bg-orange-50 rounded">
                                <div className="text-sm font-bold text-orange-600">{avaliacao.taxaMetabolismoBasal?.toFixed(0)}</div>
                                <div className="text-xs text-gray-600">TMB</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Visão Aluno: Lista normal
              bioimpedancias.map((avaliacao) => (
                <div key={avaliacao.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Activity className="h-6 w-6 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Minha Avaliação</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatarData(avaliacao.dataAvaliacao)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-sm font-bold text-blue-600">{avaliacao.imc?.toFixed(1)}</div>
                      <div className="text-xs text-gray-600">IMC</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-sm font-bold text-green-600">{avaliacao.percentualGordura?.toFixed(1)}%</div>
                      <div className="text-xs text-gray-600">% Gordura</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="text-sm font-bold text-purple-600">{avaliacao.massaMagra?.toFixed(1)}kg</div>
                      <div className="text-xs text-gray-600">Massa Magra</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="text-sm font-bold text-orange-600">{avaliacao.taxaMetabolismoBasal?.toFixed(0)}</div>
                      <div className="text-xs text-gray-600">TMB</div>
                    </div>
                    <div className="text-center flex flex-col space-y-1">
                      <button
                        onClick={() => setAvaliacaoDetalhes(avaliacao)}
                        className="btn-primary text-xs px-2 py-1"
                      >
                        Detalhes
                      </button>
                      <button
                        onClick={() => compararAvaliacoes(avaliacao.alunoId)}
                        className="btn-secondary text-xs px-2 py-1"
                      >
                        Comparar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div><span className="font-medium">Peso:</span> {avaliacao.peso}kg</div>
                    <div><span className="font-medium">Altura:</span> {avaliacao.altura}m</div>
                    <div><span className="font-medium">Idade:</span> {avaliacao.idade} anos</div>
                  </div>

                  {avaliacao.observacoes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <p className="text-xs font-medium text-gray-700">Observações:</p>
                      <p className="text-sm text-gray-600">{avaliacao.observacoes}</p>
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>

        {/* Modal Criar Avaliação */}
        {criandoAvaliacao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Nova Avaliação</h2>
                  <button
                    onClick={() => setCriandoAvaliacao(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={criarAvaliacao} className="space-y-6">
                  {/* Dados Básicos */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Dados Básicos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                        <select
                          value={novaAvaliacao.alunoId}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, alunoId: e.target.value })}
                          className="input-field"
                          required
                        >
                          <option value="">Selecione um aluno</option>
                          {alunos.map(aluno => (
                            <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                        <select
                          value={novaAvaliacao.sexo}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, sexo: e.target.value })}
                          className="input-field"
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                        <input
                          type="number"
                          value={novaAvaliacao.idade}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, idade: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Altura (m)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={novaAvaliacao.altura}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, altura: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.peso}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, peso: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bioimpedância */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Bioimpedância</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resistência (Ω)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.resistencia}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, resistencia: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reactância (Ω)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.reactancia}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, reactancia: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Circunferências */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Circunferências (cm)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Braço Direito</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.circunferenciaBracoDireito}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, circunferenciaBracoDireito: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Braço Esquerdo</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.circunferenciaBracoEsquerdo}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, circunferenciaBracoEsquerdo: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cintura</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.circunferenciaCintura}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, circunferenciaCintura: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quadril</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.circunferenciaQuadril}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, circunferenciaQuadril: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coxa Direita</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.circunferenciaCoxaDireita}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, circunferenciaCoxaDireita: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coxa Esquerda</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.circunferenciaCoxaEsquerda}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, circunferenciaCoxaEsquerda: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dobras Cutâneas */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Dobras Cutâneas (mm)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subescapular</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.dobraSubescapular}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, dobraSubescapular: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tricipital</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.dobraTricipital}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, dobraTricipital: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bicipital</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.dobraBicipital}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, dobraBicipital: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supra-ilíaca</label>
                        <input
                          type="number"
                          step="0.1"
                          value={novaAvaliacao.dobraSuprailiaca}
                          onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, dobraSuprailiaca: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea
                      value={novaAvaliacao.observacoes}
                      onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, observacoes: e.target.value })}
                      className="input-field"
                      rows={3}
                      placeholder="Observações sobre a avaliação..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCriandoAvaliacao(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Criar Avaliação
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detalhes da Avaliação */}
        {avaliacaoDetalhes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Detalhes da Avaliação</h2>
                  <button
                    onClick={() => setAvaliacaoDetalhes(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Dados Básicos */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Dados Básicos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold">{avaliacaoDetalhes.peso}kg</div>
                        <div className="text-xs text-gray-600">Peso</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold">{avaliacaoDetalhes.altura}m</div>
                        <div className="text-xs text-gray-600">Altura</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold">{avaliacaoDetalhes.idade} anos</div>
                        <div className="text-xs text-gray-600">Idade</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold">{avaliacaoDetalhes.sexo === 'M' ? 'Masculino' : 'Feminino'}</div>
                        <div className="text-xs text-gray-600">Sexo</div>
                      </div>
                    </div>
                  </div>

                  {/* Resultados Calculados */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Resultados</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{avaliacaoDetalhes.imc?.toFixed(1)}</div>
                        <div className="text-xs text-gray-600">IMC</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{avaliacaoDetalhes.percentualGordura?.toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">% Gordura</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{avaliacaoDetalhes.massaMagra?.toFixed(1)}kg</div>
                        <div className="text-xs text-gray-600">Massa Magra</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className="text-lg font-bold text-red-600">{avaliacaoDetalhes.massaGorda?.toFixed(1)}kg</div>
                        <div className="text-xs text-gray-600">Massa Gorda</div>
                      </div>
                      <div className="text-center p-3 bg-cyan-50 rounded">
                        <div className="text-lg font-bold text-cyan-600">{avaliacaoDetalhes.aguaCorporal?.toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Água Corporal</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded">
                        <div className="text-lg font-bold text-indigo-600">{avaliacaoDetalhes.massaMuscular?.toFixed(1)}kg</div>
                        <div className="text-xs text-gray-600">Massa Muscular</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{avaliacaoDetalhes.massaOssea?.toFixed(1)}kg</div>
                        <div className="text-xs text-gray-600">Massa Óssea</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-lg font-bold text-orange-600">{avaliacaoDetalhes.taxaMetabolismoBasal?.toFixed(0)}</div>
                        <div className="text-xs text-gray-600">TMB (kcal)</div>
                      </div>
                      <div className="text-center p-3 bg-pink-50 rounded">
                        <div className="text-lg font-bold text-pink-600">{avaliacaoDetalhes.gorduraVisceral?.toFixed(0)}</div>
                        <div className="text-xs text-gray-600">Gordura Visceral</div>
                      </div>
                      <div className="text-center p-3 bg-teal-50 rounded">
                        <div className="text-lg font-bold text-teal-600">{avaliacaoDetalhes.idadeMetabolica} anos</div>
                        <div className="text-xs text-gray-600">Idade Metabólica</div>
                      </div>
                    </div>
                  </div>

                  {/* Circunferências */}
                  {(avaliacaoDetalhes.circunferenciaBracoDireito || avaliacaoDetalhes.circunferenciaCintura) && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Circunferências (cm)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {avaliacaoDetalhes.circunferenciaBracoDireito && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.circunferenciaBracoDireito}cm</div>
                            <div className="text-xs text-gray-600">Braço Direito</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.circunferenciaBracoEsquerdo && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.circunferenciaBracoEsquerdo}cm</div>
                            <div className="text-xs text-gray-600">Braço Esquerdo</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.circunferenciaCintura && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.circunferenciaCintura}cm</div>
                            <div className="text-xs text-gray-600">Cintura</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.circunferenciaQuadril && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.circunferenciaQuadril}cm</div>
                            <div className="text-xs text-gray-600">Quadril</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.circunferenciaCoxaDireita && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.circunferenciaCoxaDireita}cm</div>
                            <div className="text-xs text-gray-600">Coxa Direita</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.circunferenciaCoxaEsquerda && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.circunferenciaCoxaEsquerda}cm</div>
                            <div className="text-xs text-gray-600">Coxa Esquerda</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dobras Cutâneas */}
                  {(avaliacaoDetalhes.dobraSubescapular || avaliacaoDetalhes.dobraTricipital) && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Dobras Cutâneas (mm)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {avaliacaoDetalhes.dobraSubescapular && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.dobraSubescapular}mm</div>
                            <div className="text-xs text-gray-600">Subescapular</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.dobraTricipital && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.dobraTricipital}mm</div>
                            <div className="text-xs text-gray-600">Tricipital</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.dobraBicipital && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.dobraBicipital}mm</div>
                            <div className="text-xs text-gray-600">Bicipital</div>
                          </div>
                        )}
                        {avaliacaoDetalhes.dobraSuprailiaca && (
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-bold">{avaliacaoDetalhes.dobraSuprailiaca}mm</div>
                            <div className="text-xs text-gray-600">Supra-ilíaca</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {avaliacaoDetalhes.observacoes && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Observações</h3>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm">{avaliacaoDetalhes.observacoes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setAvaliacaoDetalhes(null)}
                      className="btn-primary"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Comparação */}
        {comparacao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Comparar Avaliações</h2>
                  <button
                    onClick={() => setComparacao(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Seleção de Avaliações */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primeira Avaliação</label>
                      <select
                        value={comparacao.avaliacaoSelecionada1?.id || ''}
                        onChange={(e) => {
                          const avaliacao = (comparacao.avaliacoes || []).find((a: any) => a.id === e.target.value);
                          setComparacao({ ...comparacao, avaliacaoSelecionada1: avaliacao });
                        }}
                        className="input-field"
                      >
                        <option value="">Selecione uma avaliação</option>
                        {(comparacao.avaliacoes || []).map((avaliacao: any) => (
                          <option key={avaliacao.id} value={avaliacao.id}>
                            {formatarData(avaliacao.dataAvaliacao)} - Peso: {avaliacao.peso}kg
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Segunda Avaliação</label>
                      <select
                        value={comparacao.avaliacaoSelecionada2?.id || ''}
                        onChange={(e) => {
                          const avaliacao = (comparacao.avaliacoes || []).find((a: any) => a.id === e.target.value);
                          setComparacao({ ...comparacao, avaliacaoSelecionada2: avaliacao });
                        }}
                        className="input-field"
                      >
                        <option value="">Selecione uma avaliação</option>
                        {(comparacao.avaliacoes || []).map((avaliacao: any) => (
                          <option key={avaliacao.id} value={avaliacao.id}>
                            {formatarData(avaliacao.dataAvaliacao)} - Peso: {avaliacao.peso}kg
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {comparacao.avaliacaoSelecionada1 && comparacao.avaliacaoSelecionada2 && (
                    <div className="text-center">
                      <button
                        onClick={() => compararDuasAvaliacoes(comparacao.avaliacaoSelecionada1, comparacao.avaliacaoSelecionada2)}
                        className="btn-primary"
                      >
                        Comparar Avaliações
                      </button>
                    </div>
                  )}

                  {/* Resultado da Comparação */}
                  {comparacao.resultadoComparacao && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {formatarData(comparacao.resultadoComparacao.DataAnterior)} → {formatarData(comparacao.resultadoComparacao.DataAtual)}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {Math.ceil((new Date(comparacao.resultadoComparacao.DataAtual).getTime() - new Date(comparacao.resultadoComparacao.DataAnterior).getTime()) / (1000 * 60 * 60 * 24))} dias
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Peso */}
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">
                            {comparacao.resultadoComparacao.Peso.Anterior.toFixed(1)} → {comparacao.resultadoComparacao.Peso.Atual.toFixed(1)}kg
                          </div>
                          <div className="text-sm">
                            <span className={getIndicadorTendencia(comparacao.resultadoComparacao.Peso.Diferenca).color}>
                              {getIndicadorTendencia(comparacao.resultadoComparacao.Peso.Diferenca).icon} {comparacao.resultadoComparacao.Peso.Diferenca > 0 ? '+' : ''}{comparacao.resultadoComparacao.Peso.Diferenca.toFixed(1)}kg
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">Peso</div>
                        </div>

                        {/* % Gordura */}
                        <div className="text-center p-3 bg-red-50 rounded">
                          <div className="text-lg font-bold text-red-600">
                            {comparacao.resultadoComparacao.PercentualGordura.Anterior.toFixed(1)} → {comparacao.resultadoComparacao.PercentualGordura.Atual.toFixed(1)}%
                          </div>
                          <div className="text-sm">
                            <span className={getIndicadorTendencia(comparacao.resultadoComparacao.PercentualGordura.Diferenca, false).color}>
                              {getIndicadorTendencia(comparacao.resultadoComparacao.PercentualGordura.Diferenca, false).icon} {comparacao.resultadoComparacao.PercentualGordura.Diferenca > 0 ? '+' : ''}{comparacao.resultadoComparacao.PercentualGordura.Diferenca.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">% Gordura</div>
                        </div>

                        {/* Massa Magra */}
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {comparacao.resultadoComparacao.MassaMagra.Anterior.toFixed(1)} → {comparacao.resultadoComparacao.MassaMagra.Atual.toFixed(1)}kg
                          </div>
                          <div className="text-sm">
                            <span className={getIndicadorTendencia(comparacao.resultadoComparacao.MassaMagra.Diferenca, true).color}>
                              {getIndicadorTendencia(comparacao.resultadoComparacao.MassaMagra.Diferenca, true).icon} {comparacao.resultadoComparacao.MassaMagra.Diferenca > 0 ? '+' : ''}{comparacao.resultadoComparacao.MassaMagra.Diferenca.toFixed(1)}kg
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">Massa Magra</div>
                        </div>

                        {/* Massa Muscular */}
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-600">
                            {comparacao.resultadoComparacao.MassaMuscular.Anterior.toFixed(1)} → {comparacao.resultadoComparacao.MassaMuscular.Atual.toFixed(1)}kg
                          </div>
                          <div className="text-sm">
                            <span className={getIndicadorTendencia(comparacao.resultadoComparacao.MassaMuscular.Diferenca, true).color}>
                              {getIndicadorTendencia(comparacao.resultadoComparacao.MassaMuscular.Diferenca, true).icon} {comparacao.resultadoComparacao.MassaMuscular.Diferenca > 0 ? '+' : ''}{comparacao.resultadoComparacao.MassaMuscular.Diferenca.toFixed(1)}kg
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">Massa Muscular</div>
                        </div>

                        {/* TMB */}
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-600">
                            {comparacao.resultadoComparacao.TaxaMetabolismoBasal.Anterior.toFixed(0)} → {comparacao.resultadoComparacao.TaxaMetabolismoBasal.Atual.toFixed(0)}
                          </div>
                          <div className="text-sm">
                            <span className={getIndicadorTendencia(comparacao.resultadoComparacao.TaxaMetabolismoBasal.Diferenca, true).color}>
                              {getIndicadorTendencia(comparacao.resultadoComparacao.TaxaMetabolismoBasal.Diferenca, true).icon} {comparacao.resultadoComparacao.TaxaMetabolismoBasal.Diferenca > 0 ? '+' : ''}{comparacao.resultadoComparacao.TaxaMetabolismoBasal.Diferenca.toFixed(0)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">TMB (kcal)</div>
                        </div>

                        {/* Idade Metabólica */}
                        <div className="text-center p-3 bg-teal-50 rounded">
                          <div className="text-lg font-bold text-teal-600">
                            {comparacao.resultadoComparacao.IdadeMetabolica.Anterior} → {comparacao.resultadoComparacao.IdadeMetabolica.Atual} anos
                          </div>
                          <div className="text-sm">
                            <span className={getIndicadorTendencia(comparacao.resultadoComparacao.IdadeMetabolica.Diferenca, false).color}>
                              {getIndicadorTendencia(comparacao.resultadoComparacao.IdadeMetabolica.Diferenca, false).icon} {comparacao.resultadoComparacao.IdadeMetabolica.Diferenca > 0 ? '+' : ''}{comparacao.resultadoComparacao.IdadeMetabolica.Diferenca} anos
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">Idade Metabólica</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setComparacao(null)}
                    className="btn-primary"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bioimpedancia;