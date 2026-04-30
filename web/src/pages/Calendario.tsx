import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { aulaService, alunoService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import CalendarioView from '../components/CalendarioView';

interface Aula {
  id: string;
  professorId: string;
  alunoId: string;
  dataHora: string;
  titulo: string;
  observacoes?: string;
  status: 'Agendada' | 'Realizada' | 'Remarcada' | 'Faltou';
  aulaRemarcadaId?: string;
  isAulaOriginal?: boolean;
  dataCriacao: string;
}

const Calendario: React.FC = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editando, setEditando] = useState<Aula | null>(null);
  const [criandoAula, setCriandoAula] = useState(false);
  const [novaAula, setNovaAula] = useState({
    alunoId: '',
    dataHora: '',
    titulo: '',
    observacoes: '',
    recorrencia: 'Nenhuma',
    dataFimRecorrencia: ''
  });
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [aulaDetalhes, setAulaDetalhes] = useState<Aula | null>(null);
  const [remarcandoAula, setRemarcandoAula] = useState<Aula | null>(null);
  const [novaDataRemarcacao, setNovaDataRemarcacao] = useState('');
  const [observacoesRemarcacao, setObservacoesRemarcacao] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const carregarDados = useCallback(async () => {
    try {
      const [aulasData, alunosData] = await Promise.all([
        aulaService.listar(),
        user?.tipoUsuario === 'Professor' ? alunoService.listar() : Promise.resolve([])
      ]);
      setAulas(aulasData);
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

  const criarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const aulaData: any = {
        alunoId: novaAula.alunoId,
        dataHora: new Date(novaAula.dataHora).toISOString(),
        titulo: novaAula.titulo,
        observacoes: novaAula.observacoes || undefined,
        recorrencia: novaAula.recorrencia
      };

      if (novaAula.recorrencia !== 'Nenhuma' && novaAula.dataFimRecorrencia) {
        aulaData.dataFimRecorrencia = new Date(novaAula.dataFimRecorrencia).toISOString();
      }

      const response = await aulaService.criar(aulaData);
      
      setSuccess(response.message || 'Aula(s) agendada(s) com sucesso!');
      setNovaAula({ alunoId: '', dataHora: '', titulo: '', observacoes: '', recorrencia: 'Nenhuma', dataFimRecorrencia: '' });
      setCriandoAula(false);
      carregarDados();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao agendar aula');
    }
  };

  const atualizarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;

    try {
      await aulaService.atualizar(editando.id, {
        dataHora: new Date(editando.dataHora).toISOString(),
        titulo: editando.titulo,
        observacoes: editando.observacoes || undefined
      });

      setSuccess('Aula atualizada com sucesso!');
      setEditando(null);
      carregarDados();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar aula');
    }
  };

  const atualizarStatusAula = async (id: string, status: string) => {
    if (status === 'Remarcada') {
      const aula = aulas.find(a => a.id === id);
      if (aula) {
        setRemarcandoAula(aula);
        setAulaDetalhes(null);
        return;
      }
    }
    
    try {
      await aulaService.atualizarStatus(id, status);
      setSuccess('Status da aula atualizado!');
      carregarDados();
      setAulaDetalhes(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  const remarcarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarcandoAula) return;

    try {
      await aulaService.remarcar(remarcandoAula.id, {
        novaDataHora: new Date(novaDataRemarcacao).toISOString(),
        observacoes: observacoesRemarcacao || undefined
      });
      
      setSuccess('Aula remarcada com sucesso!');
      setRemarcandoAula(null);
      setNovaDataRemarcacao('');
      setObservacoesRemarcacao('');
      carregarDados();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remarcar aula');
    }
  };

  const deletarAula = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta aula?')) return;

    try {
      await aulaService.deletar(id);
      setSuccess('Aula deletada com sucesso!');
      carregarDados();
      setAulaDetalhes(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar aula');
    }
  };

  const getNomeAluno = (alunoId: string) => {
    if (user?.tipoUsuario === 'Professor') {
      const aluno = alunos.find(a => a.id === alunoId);
      return aluno ? aluno.nome : 'Aluno não encontrado';
    } else {
      // Para alunos, mostrar o nome do professor
      return (aulas[0] as any)?.nomeProfessor || user?.nome || 'Professor';
    }
  };

  const formatarDataHora = (dataHora: string) => {
    const data = new Date(dataHora);
    return {
      data: data.toLocaleDateString('pt-BR'),
      hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
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
          <p className="mt-4 text-gray-600">Carregando calendário...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Calendário</h1>
          </div>
          
          <div className="flex items-center justify-between w-full sm:w-auto space-x-2 sm:space-x-4">
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-2 sm:px-3 py-2 rounded text-xs sm:text-sm ${viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                <span className="hidden sm:inline">Calendário</span>
                <span className="sm:hidden">Cal</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 sm:px-3 py-2 rounded text-xs sm:text-sm ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                Lista
              </button>
            </div>
            
            {user?.tipoUsuario === 'Professor' && (
              <button
                onClick={() => setCriandoAula(true)}
                className="btn-primary flex items-center text-sm"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Agendar Aula</span>
                <span className="sm:hidden">Nova</span>
              </button>
            )}
          </div>
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

        {/* Conteúdo Principal */}
        {viewMode === 'calendar' ? (
          <CalendarioView 
            aulas={aulas}
            onAulaClick={setAulaDetalhes}
            getNomeAluno={getNomeAluno}
          />
        ) : (
          /* Lista de Aulas */
          <div className="space-y-4">
            {aulas.length === 0 ? (
              <div className="card text-center py-8">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Nenhuma aula agendada ainda.</p>
                {user?.tipoUsuario === 'Professor' && (
                  <button
                    onClick={() => setCriandoAula(true)}
                    className="btn-primary"
                  >
                    Agendar Primeira Aula
                  </button>
                )}
              </div>
            ) : (
              aulas
                .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                .map((aula) => {
                  const { data, hora } = formatarDataHora(aula.dataHora);
                  const getStatusBadge = (status: string) => {
                    const colors = {
                      'Agendada': 'bg-gray-500',
                      'Realizada': 'bg-green-500',
                      'Remarcada': 'bg-blue-500',
                      'Faltou': 'bg-red-500'
                    };
                    return colors[status as keyof typeof colors] || 'bg-gray-500';
                  };
                  
                  const aulaStatus = aula.status || 'Agendada';
                  
                  return (
                    <div key={aula.id} className="card">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <CalendarIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <h3 className={`font-semibold text-gray-900 ${aula.status === 'Remarcada' ? 'line-through opacity-75' : ''}`}>
                              {getNomeAluno(aula.alunoId)}
                            </h3>
                            <span className={`ml-2 px-2 py-1 text-white text-xs rounded ${getStatusBadge(aulaStatus)}`}>
                              {aulaStatus}
                            </span>
                            {aula.status === 'Remarcada' && (
                              <span className="ml-2 text-xs text-gray-500">(Remarcada)</span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{data} às {hora}</span>
                            </div>
                            
                            {aula.observacoes && (
                              <div className="md:col-span-3">
                                <span className="font-medium">Observações:</span> {aula.observacoes}
                              </div>
                            )}
                            

                          </div>
                        </div>
                        
                        {user?.tipoUsuario === 'Professor' && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setAulaDetalhes(aula)}
                              className="text-green-600 hover:text-green-800"
                              title="Gerenciar Status"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditando(aula)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deletarAula(aula.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Deletar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Modal Criar Aula */}
        {criandoAula && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Agendar Nova Aula</h2>
                  <button
                    onClick={() => setCriandoAula(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={criarAula} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aluno
                    </label>
                    <select
                      value={novaAula.alunoId}
                      onChange={(e) => setNovaAula({ ...novaAula, alunoId: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data e Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={novaAula.dataHora}
                      onChange={(e) => setNovaAula({ ...novaAula, dataHora: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={novaAula.observacoes}
                      onChange={(e) => setNovaAula({ ...novaAula, observacoes: e.target.value })}
                      className="input-field"
                      rows={3}
                      placeholder="Observações sobre a aula..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recorrência
                    </label>
                    <select
                      value={novaAula.recorrencia}
                      onChange={(e) => setNovaAula({ ...novaAula, recorrencia: e.target.value })}
                      className="input-field"
                    >
                      <option value="Nenhuma">Aula única</option>
                      <option value="Diaria">Diária</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quinzenal">Quinzenal</option>
                      <option value="Mensal">Mensal</option>
                    </select>
                  </div>

                  {novaAula.recorrencia !== 'Nenhuma' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repetir até
                      </label>
                      <input
                        type="date"
                        value={novaAula.dataFimRecorrencia}
                        onChange={(e) => setNovaAula({ ...novaAula, dataFimRecorrencia: e.target.value })}
                        className="input-field"
                        min={novaAula.dataHora.split('T')[0]}
                        required
                      />
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCriandoAula(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Agendar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Remarcar Aula */}
        {remarcandoAula && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Remarcar Aula</h2>
                  <button
                    onClick={() => setRemarcandoAula(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">{remarcandoAula.titulo}</h3>
                  <p className="text-sm text-gray-600">{getNomeAluno(remarcandoAula.alunoId)}</p>
                  <p className="text-sm text-gray-600">
                    Data atual: {formatarDataHora(remarcandoAula.dataHora).data} às {formatarDataHora(remarcandoAula.dataHora).hora}
                  </p>
                </div>

                <form onSubmit={remarcarAula} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Data e Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={novaDataRemarcacao}
                      onChange={(e) => setNovaDataRemarcacao(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={observacoesRemarcacao}
                      onChange={(e) => setObservacoesRemarcacao(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Motivo da remarcação..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setRemarcandoAula(null)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Remarcar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detalhes/Status da Aula */}
        {aulaDetalhes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Gerenciar Aula</h2>
                  <button
                    onClick={() => setAulaDetalhes(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{getNomeAluno(aulaDetalhes.alunoId)}</h3>
                    <p className="text-sm text-gray-600">
                      {formatarDataHora(aulaDetalhes.dataHora).data} às {formatarDataHora(aulaDetalhes.dataHora).hora}
                    </p>
                    {aulaDetalhes.observacoes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-xs font-medium text-gray-700">Observações:</p>
                        <p className="text-sm text-gray-600">{aulaDetalhes.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {user?.tipoUsuario === 'Professor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status da Aula
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Agendada', 'Realizada', 'Remarcada', 'Faltou'].map(status => (
                          <button
                            key={status}
                            onClick={() => atualizarStatusAula(aulaDetalhes.id, status)}
                            className={`p-2 text-sm rounded ${
                              (aulaDetalhes.status || 'Agendada') === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setAulaDetalhes(null)}
                      className="flex-1 btn-secondary"
                    >
                      Fechar
                    </button>
                    {user?.tipoUsuario === 'Professor' && (
                      <button
                        onClick={() => {
                          setEditando(aulaDetalhes);
                          setAulaDetalhes(null);
                        }}
                        className="flex-1 btn-primary"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar Aula */}
        {editando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Editar Aula</h2>
                  <button
                    onClick={() => setEditando(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={atualizarAula} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aluno
                    </label>
                    <input
                      type="text"
                      value={getNomeAluno(editando.alunoId)}
                      className="input-field bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data e Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={editando.dataHora ? new Date(editando.dataHora).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditando({ ...editando, dataHora: new Date(e.target.value).toISOString() })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título da Aula
                    </label>
                    <input
                      type="text"
                      value={editando.titulo || ''}
                      onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={editando.observacoes || ''}
                      onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
                      className="input-field"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditando(null)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Calendario;