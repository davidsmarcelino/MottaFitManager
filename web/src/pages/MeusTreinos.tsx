import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Dumbbell } from 'lucide-react';
import { treinoService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Treino } from '../types';
import Layout from '../components/Layout';
import HistoricoCarga from '../components/HistoricoCarga';

const MeusTreinos: React.FC = () => {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editando, setEditando] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    try {
      const data = await treinoService.listar();
      setTreinos(data);
    } catch (err: any) {
      setError('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const atualizarCarga = (treinoId: string, exercicioId: string, novaCarga: number, dia?: string) => {
    setTreinos(treinos.map(treino => {
      if (treino.id !== treinoId) return treino;

      if (treino.treinoSemanal && dia) {
        return {
          ...treino,
          exerciciosPorDia: {
            ...treino.exerciciosPorDia,
            [dia]: treino.exerciciosPorDia?.[dia]?.map(ex => 
              ex.exercicioId === exercicioId ? { ...ex, carga: novaCarga } : ex
            ) || []
          }
        };
      } else {
        return {
          ...treino,
          exercicios: treino.exercicios.map(ex => 
            ex.exercicioId === exercicioId ? { ...ex, carga: novaCarga } : ex
          )
        };
      }
    }));
  };

  const salvarCargas = async (treino: Treino) => {
    try {
      const atualizacoes: any[] = [];

      if (treino.treinoSemanal) {
        Object.entries(treino.exerciciosPorDia || {}).forEach(([dia, exercicios]) => {
          exercicios.forEach(ex => {
            atualizacoes.push({
              exercicioId: ex.exercicioId,
              dia: dia,
              novaCarga: ex.carga
            });
          });
        });
      } else {
        treino.exercicios.forEach(ex => {
          atualizacoes.push({
            exercicioId: ex.exercicioId,
            novaCarga: ex.carga
          });
        });
      }

      await treinoService.atualizarCarga(treino.id, { atualizacoesCarga: atualizacoes });
      
      setEditando({ ...editando, [treino.id]: false });
      setSuccess('Cargas atualizadas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Erro ao atualizar cargas');
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
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
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

        {treinos.length === 0 ? (
          <div className="card text-center py-8">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Nenhum treino foi criado para você ainda.</p>
            <p className="text-sm text-gray-500">Entre em contato com seu professor para criar seus treinos.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {treinos.map((treino) => (
              <div key={treino.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{treino.nome}</h2>
                    <p className="text-sm text-gray-600">
                      {treino.treinoSemanal ? 'Treino Semanal' : `${treino.exercicios.length} exercício(s)`}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {editando[treino.id] ? (
                      <>
                        <button
                          onClick={() => salvarCargas(treino)}
                          className="btn-primary text-sm flex items-center"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditando({ ...editando, [treino.id]: false });
                            carregarTreinos();
                          }}
                          className="btn-secondary text-sm"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditando({ ...editando, [treino.id]: true })}
                        className="btn-primary text-sm"
                      >
                        Editar Cargas
                      </button>
                    )}
                  </div>
                </div>

                {treino.treinoSemanal ? (
                  <div className="space-y-4">
                    {Object.entries(treino.exerciciosPorDia || {}).map(([dia, exercicios]) => (
                      <div key={dia} className="border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-3 text-primary-600">{dia}</h3>
                        <div className="space-y-3">
                          {exercicios.map((exercicio, index) => (
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
                              
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Séries:</span> {exercicio.series}
                                </div>
                                <div>
                                  <span className="font-medium">Repetições:</span> {exercicio.repeticoes}
                                </div>
                                <div>
                                  <span className="font-medium">Carga:</span>
                                  {editando[treino.id] ? (
                                    <input
                                      type="number"
                                      value={exercicio.carga || ''}
                                      onChange={(e) => atualizarCarga(treino.id, exercicio.exercicioId, e.target.value === '' ? 0 : Number(e.target.value), dia)}
                                      className="input-field text-sm ml-2 w-20"
                                      min="0"
                                      step="0.5"
                                      placeholder="0"
                                    />
                                  ) : (
                                    <span> {exercicio.carga}kg</span>
                                  )}
                                </div>
                                <div className="col-span-4">
                                  {exercicio.observacoes && (
                                    <div className="mb-2">
                                      <span className="font-medium">Observações:</span> {exercicio.observacoes}
                                    </div>
                                  )}
                                  <HistoricoCarga
                                    treinoId={treino.id}
                                    exercicioId={exercicio.exercicioId}
                                    exercicioNome={exercicio.nome}
                                    dia={dia}
                                    cargaAtual={exercicio.carga}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {treino.exercicios.map((exercicio, index) => (
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
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Séries:</span> {exercicio.series}
                          </div>
                          <div>
                            <span className="font-medium">Repetições:</span> {exercicio.repeticoes}
                          </div>
                          <div>
                            <span className="font-medium">Carga:</span>
                            {editando[treino.id] ? (
                              <input
                                type="number"
                                value={exercicio.carga || ''}
                                onChange={(e) => atualizarCarga(treino.id, exercicio.exercicioId, e.target.value === '' ? 0 : Number(e.target.value))}
                                className="input-field text-sm ml-2 w-20"
                                min="0"
                                step="0.5"
                                placeholder="0"
                              />
                            ) : (
                              <span> {exercicio.carga}kg</span>
                            )}
                          </div>
                          <div className="col-span-4">
                            {exercicio.observacoes && (
                              <div className="mb-2">
                                <span className="font-medium">Observações:</span> {exercicio.observacoes}
                              </div>
                            )}
                            <HistoricoCarga
                              treinoId={treino.id}
                              exercicioId={exercicio.exercicioId}
                              exercicioNome={exercicio.nome}
                              cargaAtual={exercicio.carga}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MeusTreinos;