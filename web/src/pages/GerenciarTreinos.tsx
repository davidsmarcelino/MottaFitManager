import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Eye, Filter, User, ChevronDown, ChevronRight } from 'lucide-react';
import { treinoService, exercicioService, alunoService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Treino } from '../types';
import Layout from '../components/Layout';
import HistoricoCarga from '../components/HistoricoCarga';

const GerenciarTreinos: React.FC = () => {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [treinosFiltrados, setTreinosFiltrados] = useState<Treino[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(null);
  const [editando, setEditando] = useState<Treino | null>(null);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda');
  const [buscaExercicio, setBuscaExercicio] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    try {
      const [treinosData, exerciciosData, alunosData] = await Promise.all([
        treinoService.listar(),
        exercicioService.listar(),
        alunoService.listar()
      ]);
      setTreinos(treinosData);
      setTreinosFiltrados(treinosData);
      setExercicios(exerciciosData);
      setAlunos(alunosData);
    } catch (err: any) {
      setError('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorAluno = (alunoId: string) => {
    setAlunoSelecionado(alunoId);
    
    if (alunoId === '') {
      setTreinosFiltrados(treinos);
    } else {
      const treinosFiltrados = treinos.filter(treino => treino.alunoId === alunoId);
      setTreinosFiltrados(treinosFiltrados);
    }
  };

  const getNomeAluno = (alunoId: string) => {
    const aluno = alunos.find(a => a.id === alunoId);
    return aluno ? aluno.nome : 'Aluno não encontrado';
  };

  const handleEditar = async (treino: Treino) => {
    try {
      const payload: any = {
        nome: treino.nome
      };

      if (treino.treinoSemanal) {
        payload.treinoSemanal = true;
        payload.exerciciosPorDia = {};
        
        Object.entries(treino.exerciciosPorDia || {}).forEach(([dia, exercicios]) => {
          payload.exerciciosPorDia[dia] = exercicios.map(ex => ({
            exercicioId: ex.exercicioId,
            series: ex.series,
            repeticoes: ex.repeticoes,
            carga: ex.carga,
            observacoes: ex.observacoes
          }));
        });
      } else {
        payload.treinoSemanal = false;
        payload.exercicios = treino.exercicios.map(ex => ({
          exercicioId: ex.exercicioId,
          series: ex.series,
          repeticoes: ex.repeticoes,
          carga: ex.carga,
          observacoes: ex.observacoes
        }));
      }

      await treinoService.atualizar(treino.id, payload);
      
      setEditando(null);
      carregarTreinos();
    } catch (err: any) {
      setError('Erro ao atualizar treino');
    }
  };

  const adicionarExercicio = (exercicio: any) => {
    if (!editando) return;
    
    const novoExercicio = {
      exercicioId: exercicio.id,
      nome: exercicio.nome,
      categoria: exercicio.categoria,
      series: 0,
      repeticoes: 0,
      carga: 0,
      observacoes: '',
      videoUrl: exercicio.videoUrl
    };

    if (editando.treinoSemanal) {
      const exerciciosNoDia = editando.exerciciosPorDia?.[diaSelecionado] || [];
      const jaAdicionado = exerciciosNoDia.find(e => e.exercicioId === exercicio.id);
      if (jaAdicionado) {
        setError('Exercício já foi adicionado neste dia');
        return;
      }

      setEditando({
        ...editando,
        exerciciosPorDia: {
          ...editando.exerciciosPorDia,
          [diaSelecionado]: [...exerciciosNoDia, novoExercicio]
        }
      });
    } else {
      const jaAdicionado = editando.exercicios.find(e => e.exercicioId === exercicio.id);
      if (jaAdicionado) {
        setError('Exercício já foi adicionado ao treino');
        return;
      }

      setEditando({
        ...editando,
        exercicios: [...editando.exercicios, novoExercicio]
      });
    }
    setError('');
  };

  const removerExercicio = (index: number, dia?: string) => {
    if (!editando) return;
    
    if (editando.treinoSemanal && dia) {
      const exerciciosNoDia = editando.exerciciosPorDia?.[dia] || [];
      setEditando({
        ...editando,
        exerciciosPorDia: {
          ...editando.exerciciosPorDia,
          [dia]: exerciciosNoDia.filter((_, i) => i !== index)
        }
      });
    } else {
      setEditando({
        ...editando,
        exercicios: editando.exercicios.filter((_, i) => i !== index)
      });
    }
  };

  const atualizarExercicio = (index: number, campo: string, valor: any, dia?: string) => {
    if (!editando) return;
    
    if (editando.treinoSemanal && dia) {
      const exerciciosNoDia = [...(editando.exerciciosPorDia?.[dia] || [])];
      exerciciosNoDia[index] = { ...exerciciosNoDia[index], [campo]: valor };
      
      setEditando({
        ...editando,
        exerciciosPorDia: {
          ...editando.exerciciosPorDia,
          [dia]: exerciciosNoDia
        }
      });
    } else {
      const novosExercicios = [...editando.exercicios];
      novosExercicios[index] = { ...novosExercicios[index], [campo]: valor };
      
      setEditando({
        ...editando,
        exercicios: novosExercicios
      });
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este treino?')) {
      try {
        await treinoService.deletar(id);
        carregarTreinos();
      } catch (err: any) {
        setError('Erro ao deletar treino');
      }
    }
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
          <p className="mt-4 text-gray-600">Carregando treinos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Treinos</h1>
          </div>
          
          <button
            onClick={() => navigate('/treinos/criar')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Treino
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Filtro por Aluno */}
        <div className="filter-card">
          <div className="flex items-start space-x-3">
            <Filter className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Aluno
              </label>
              <select
                value={alunoSelecionado}
                onChange={(e) => filtrarPorAluno(e.target.value)}
                className="select-mobile"
              >
                <option value="">Todos ({treinos.length})</option>
                {alunos.map(aluno => {
                  const treinosDoAluno = treinos.filter(t => t.alunoId === aluno.id).length;
                  return (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} ({treinosDoAluno})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {treinosFiltrados.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-600 mb-4">
              {alunoSelecionado ? 'Nenhum treino encontrado para este aluno.' : 'Nenhum treino criado ainda.'}
            </p>
            {!alunoSelecionado && (
              <button
                onClick={() => navigate('/treinos/criar')}
                className="btn-primary"
              >
                Criar Primeiro Treino
              </button>
            )}
          </div>
        ) : (
          <TreinosAgrupados 
            treinos={treinosFiltrados}
            alunos={alunos}
            onVisualizarTreino={setTreinoSelecionado}
            onEditarTreino={setEditando}
            onDeletarTreino={handleDeletar}
          />
        )}

        {/* Modal de Edição */}
        {editando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Editar Treino</h2>
                  <button
                    onClick={() => setEditando(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Formulário */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Treino
                      </label>
                      <input
                        type="text"
                        value={editando.nome}
                        onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div className="mb-4">
                      {editando.treinoSemanal ? (
                        <div>
                          <h3 className="font-medium mb-2">Treino Semanal</h3>
                          <div className="mb-3">
                            <select
                              value={diaSelecionado}
                              onChange={(e) => setDiaSelecionado(e.target.value)}
                              className="select-mobile text-sm"
                            >
                              {Object.keys(editando.exerciciosPorDia || {}).map(dia => (
                                <option key={dia} value={dia}>
                                  {dia} ({(editando.exerciciosPorDia?.[dia] || []).length} exercícios)
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {(editando.exerciciosPorDia?.[diaSelecionado] || []).map((ex, index) => (
                              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium text-sm">{ex.nome}</h4>
                                    <p className="text-xs text-gray-600">{ex.categoria}</p>
                                  </div>
                                  <button
                                    onClick={() => removerExercicio(index, diaSelecionado)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Séries</label>
                                    <input
                                      type="number"
                                      value={ex.series || ''}
                                      onChange={(e) => atualizarExercicio(index, 'series', e.target.value === '' ? 0 : Number(e.target.value), diaSelecionado)}
                                      className="input-field text-xs"
                                      min="0"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Repetições</label>
                                    <input
                                      type="number"
                                      value={ex.repeticoes || ''}
                                      onChange={(e) => atualizarExercicio(index, 'repeticoes', e.target.value === '' ? 0 : Number(e.target.value), diaSelecionado)}
                                      className="input-field text-xs"
                                      min="0"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Carga (kg)</label>
                                    <input
                                      type="number"
                                      value={ex.carga || ''}
                                      onChange={(e) => atualizarExercicio(index, 'carga', e.target.value === '' ? 0 : Number(e.target.value), diaSelecionado)}
                                      className="input-field text-xs"
                                      min="0"
                                      step="0.5"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                                  <input
                                    type="text"
                                    value={ex.observacoes || ''}
                                    onChange={(e) => atualizarExercicio(index, 'observacoes', e.target.value, diaSelecionado)}
                                    className="input-field text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium mb-2">Exercícios ({editando.exercicios.length})</h3>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {editando.exercicios.map((ex, index) => (
                              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium text-sm">{ex.nome}</h4>
                                    <p className="text-xs text-gray-600">{ex.categoria}</p>
                                  </div>
                                  <button
                                    onClick={() => removerExercicio(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Séries</label>
                                    <input
                                      type="number"
                                      value={ex.series || ''}
                                      onChange={(e) => atualizarExercicio(index, 'series', e.target.value === '' ? 0 : Number(e.target.value))}
                                      className="input-field text-xs"
                                      min="0"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Repetições</label>
                                    <input
                                      type="number"
                                      value={ex.repeticoes || ''}
                                      onChange={(e) => atualizarExercicio(index, 'repeticoes', e.target.value === '' ? 0 : Number(e.target.value))}
                                      className="input-field text-xs"
                                      min="0"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Carga (kg)</label>
                                    <input
                                      type="number"
                                      value={ex.carga || ''}
                                      onChange={(e) => atualizarExercicio(index, 'carga', e.target.value === '' ? 0 : Number(e.target.value))}
                                      className="input-field text-xs"
                                      min="0"
                                      step="0.5"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                                  <input
                                    type="text"
                                    value={ex.observacoes || ''}
                                    onChange={(e) => atualizarExercicio(index, 'observacoes', e.target.value)}
                                    className="input-field text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lista de Exercícios */}
                  <div>
                    <h3 className="font-medium mb-2">Adicionar Exercícios</h3>
                    
                    <div className="mb-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Buscar exercícios..."
                        value={buscaExercicio}
                        onChange={(e) => setBuscaExercicio(e.target.value)}
                        className="input-field text-sm"
                      />
                      
                      <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="select-mobile text-sm"
                      >
                        <option value="">Todas as categorias</option>
                        <option value="Peito">Peito</option>
                        <option value="Costas">Costas</option>
                        <option value="Ombros">Ombros</option>
                        <option value="Bíceps">Bíceps</option>
                        <option value="Tríceps">Tríceps</option>
                        <option value="Pernas">Pernas</option>
                        <option value="Abdômen">Abdômen</option>
                        <option value="Aeróbico">Aeróbico</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {exercicios.filter(exercicio => {
                        // Filtro de busca
                        const matchBusca = exercicio.nome.toLowerCase().includes(buscaExercicio.toLowerCase()) ||
                                          exercicio.categoria.toLowerCase().includes(buscaExercicio.toLowerCase());
                        
                        // Filtro de categoria
                        const matchCategoria = categoriaFiltro === '' || exercicio.categoria === categoriaFiltro;
                        
                        // Filtro de exercícios já adicionados
                        let jaAdicionado = false;
                        if (editando?.treinoSemanal) {
                          const exerciciosNoDia = editando.exerciciosPorDia?.[diaSelecionado] || [];
                          jaAdicionado = exerciciosNoDia.find(e => e.exercicioId === exercicio.id) !== undefined;
                        } else {
                          jaAdicionado = editando?.exercicios.find(e => e.exercicioId === exercicio.id) !== undefined;
                        }
                        
                        return matchBusca && matchCategoria && !jaAdicionado;
                      }).map(exercicio => (
                        <div key={exercicio.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                          <div>
                            <h4 className="font-medium text-sm">{exercicio.nome}</h4>
                            <p className="text-xs text-gray-600">{exercicio.categoria}</p>
                          </div>
                          <button
                            onClick={() => adicionarExercicio(exercicio)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setEditando(null)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleEditar(editando)}
                    className="btn-primary"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Visualização */}
        {treinoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{treinoSelecionado.nome}</h2>
                    <p className="text-sm text-primary-600 font-medium">
                      Aluno: {getNomeAluno(treinoSelecionado.alunoId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {treinoSelecionado.treinoSemanal ? 'Treino Semanal' : `${treinoSelecionado.exercicios.length} exercício(s)`}
                    </p>
                  </div>
                  <button
                    onClick={() => setTreinoSelecionado(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {treinoSelecionado.treinoSemanal ? (
                    Object.entries(treinoSelecionado.exerciciosPorDia || {}).map(([dia, exercicios]) => (
                      <div key={dia} className="border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-3 text-primary-600">{dia}</h3>
                        <div className="space-y-3">
                          {exercicios.map((exercicio: any, index: number) => (
                            <div key={index} className="border-l-4 border-gray-200 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium">{exercicio.nome}</h4>
                                  <p className="text-sm text-gray-600">{exercicio.categoria}</p>
                                </div>
                                {exercicio.videoUrl && (
                                  <a
                                    href={exercicio.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    Ver vídeo
                                  </a>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Séries:</span> {exercicio.series}
                                </div>
                                <div>
                                  <span className="font-medium">Repetições:</span> {exercicio.repeticoes}
                                </div>
                                <div>
                                  <span className="font-medium">Carga:</span> {exercicio.carga}kg
                                </div>
                              </div>
                              
                              {exercicio.observacoes && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Observações:</span> {exercicio.observacoes}
                                </div>
                              )}
                              <HistoricoCarga
                                treinoId={treinoSelecionado.id}
                                exercicioId={exercicio.exercicioId}
                                exercicioNome={exercicio.nome}
                                dia={dia}
                                cargaAtual={exercicio.carga}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    treinoSelecionado.exercicios.map((exercicio, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{exercicio.nome}</h3>
                            <p className="text-sm text-gray-600">{exercicio.categoria}</p>
                          </div>
                          {exercicio.videoUrl && (
                            <a
                              href={exercicio.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ver vídeo
                            </a>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Séries:</span> {exercicio.series}
                          </div>
                          <div>
                            <span className="font-medium">Repetições:</span> {exercicio.repeticoes}
                          </div>
                          <div>
                            <span className="font-medium">Carga:</span> {exercicio.carga}kg
                          </div>
                        </div>
                        
                        {exercicio.observacoes && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Observações:</span> {exercicio.observacoes}
                          </div>
                        )}
                        <HistoricoCarga
                          treinoId={treinoSelecionado.id}
                          exercicioId={exercicio.exercicioId}
                          exercicioNome={exercicio.nome}
                          cargaAtual={exercicio.carga}
                        />
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setTreinoSelecionado(null)}
                    className="btn-secondary"
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

// Componente para treinos agrupados por aluno
const TreinosAgrupados: React.FC<{
  treinos: Treino[];
  alunos: any[];
  onVisualizarTreino: (treino: Treino) => void;
  onEditarTreino: (treino: Treino) => void;
  onDeletarTreino: (id: string) => void;
}> = ({ treinos, alunos, onVisualizarTreino, onEditarTreino, onDeletarTreino }) => {
  const [alunosExpandidos, setAlunosExpandidos] = useState<Set<string>>(new Set());

  const getNomeAluno = (alunoId: string) => {
    const aluno = alunos.find(a => a.id === alunoId);
    return aluno ? aluno.nome : 'Aluno não encontrado';
  };

  const treinosAgrupados = treinos.reduce((grupos: any, treino) => {
    const alunoId = treino.alunoId;
    if (!grupos[alunoId]) grupos[alunoId] = [];
    grupos[alunoId].push(treino);
    return grupos;
  }, {});

  const toggleExpansao = (alunoId: string) => {
    const newSet = new Set(alunosExpandidos);
    if (alunosExpandidos.has(alunoId)) {
      newSet.delete(alunoId);
    } else {
      newSet.add(alunoId);
    }
    setAlunosExpandidos(newSet);
  };

  return (
    <div className="space-y-4">
      {Object.entries(treinosAgrupados).map(([alunoId, treinosDoAluno]: [string, any]) => {
        const isExpandido = alunosExpandidos.has(alunoId);
        
        return (
          <div key={alunoId} className="card">
            <div 
              className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50"
              onClick={() => toggleExpansao(alunoId)}
            >
              <div className="flex items-center">
                <User className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{getNomeAluno(alunoId)}</h3>
                  <p className="text-sm text-gray-600">{treinosDoAluno.length} treino(s)</p>
                </div>
              </div>
              <div className="flex items-center">
                {isExpandido ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {isExpandido && (
              <div className="border-t p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {treinosDoAluno.map((treino: Treino) => (
                    <div key={treino.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{treino.nome}</h4>
                          <p className="text-xs text-gray-600">
                            {treino.treinoSemanal ? 'Treino Semanal' : `${treino.exercicios.length} exercício(s)`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(treino.dataCriacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onVisualizarTreino(treino);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Visualizar"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditarTreino(treino);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Editar"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletarTreino(treino.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Deletar"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        {treino.treinoSemanal ? (
                          <div>
                            <span className="font-medium">Dias:</span>
                            <div className="mt-1">
                              {Object.entries(treino.exerciciosPorDia || {}).slice(0, 2).map(([dia, exercicios]) => (
                                <div key={dia}>
                                  {dia}: {exercicios.length} ex.
                                </div>
                              ))}
                              {Object.keys(treino.exerciciosPorDia || {}).length > 2 && (
                                <div className="text-gray-500">
                                  +{Object.keys(treino.exerciciosPorDia || {}).length - 2} dias
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            {treino.exercicios.slice(0, 2).map((ex, index) => (
                              <div key={index} className="truncate">
                                {ex.nome} - {ex.series}x{ex.repeticoes}
                              </div>
                            ))}
                            {treino.exercicios.length > 2 && (
                              <div className="text-gray-500">
                                +{treino.exercicios.length - 2} exercícios
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GerenciarTreinos;