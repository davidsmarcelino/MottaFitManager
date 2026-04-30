import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Search } from 'lucide-react';
import { treinoService, exercicioService, alunoService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Exercicio } from '../types';
import Layout from '../components/Layout';

interface ExercicioSelecionado {
  exercicioId: string;
  nome: string;
  categoria: string;
  series: number | string;
  repeticoes: number | string;
  carga: number | string;
  observacoes: string;
}

interface TreinoSemanal {
  [key: string]: ExercicioSelecionado[];
}

const CriarTreino: React.FC = () => {
  const [nome, setNome] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [alunos, setAlunos] = useState<any[]>([]);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState<ExercicioSelecionado[]>([]);
  const [modoSemanal, setModoSemanal] = useState(false);
  const [treinoSemanal, setTreinoSemanal] = useState<TreinoSemanal>({
    'Segunda': [],
    'Terça': [],
    'Quarta': [],
    'Quinta': [],
    'Sexta': [],
    'Sábado': [],
    'Domingo': []
  });
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [buscaExercicio, setBuscaExercicio] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [exerciciosData, alunosData] = await Promise.all([
        exercicioService.listar(),
        alunoService.listar()
      ]);
      setExercicios(exerciciosData);
      setAlunos(alunosData);
    } catch (err: any) {
      setError('Erro ao carregar dados');
    }
  };

  const adicionarExercicio = (exercicio: Exercicio) => {
    const novoExercicio: ExercicioSelecionado = {
      exercicioId: exercicio.id,
      nome: exercicio.nome,
      categoria: exercicio.categoria,
      series: '',
      repeticoes: '',
      carga: '',
      observacoes: ''
    };

    if (modoSemanal) {
      const exerciciosNoDia = treinoSemanal[diaSelecionado];
      const jaAdicionado = exerciciosNoDia.find(e => e.exercicioId === exercicio.id);
      if (jaAdicionado) {
        setError('Exercício já foi adicionado neste dia');
        return;
      }

      setTreinoSemanal({
        ...treinoSemanal,
        [diaSelecionado]: [...exerciciosNoDia, novoExercicio]
      });
    } else {
      const jaAdicionado = exerciciosSelecionados.find(e => e.exercicioId === exercicio.id);
      if (jaAdicionado) {
        setError('Exercício já foi adicionado ao treino');
        return;
      }
      setExerciciosSelecionados([...exerciciosSelecionados, novoExercicio]);
    }
    
    setError('');
  };

  const removerExercicio = (index: number, dia?: string) => {
    if (modoSemanal && dia) {
      const exerciciosNoDia = treinoSemanal[dia];
      setTreinoSemanal({
        ...treinoSemanal,
        [dia]: exerciciosNoDia.filter((_, i) => i !== index)
      });
    } else {
      setExerciciosSelecionados(exerciciosSelecionados.filter((_, i) => i !== index));
    }
    setError(''); // Limpar erro ao remover
  };

  const atualizarExercicio = (index: number, campo: string, valor: any, dia?: string) => {
    if (modoSemanal && dia) {
      const exerciciosNoDia = [...treinoSemanal[dia]];
      exerciciosNoDia[index] = { ...exerciciosNoDia[index], [campo]: valor };
      setTreinoSemanal({
        ...treinoSemanal,
        [dia]: exerciciosNoDia
      });
    } else {
      const novosExercicios = [...exerciciosSelecionados];
      novosExercicios[index] = { ...novosExercicios[index], [campo]: valor };
      setExerciciosSelecionados(novosExercicios);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let temExercicios = false;
    
    if (modoSemanal) {
      temExercicios = Object.values(treinoSemanal).some(exercicios => exercicios.length > 0);
      if (!temExercicios) {
        setError('Adicione pelo menos um exercício em algum dia da semana');
        return;
      }
    } else {
      if (exerciciosSelecionados.length === 0) {
        setError('Adicione pelo menos um exercício ao treino');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (modoSemanal) {
        // Criar um único treino com exercícios organizados por dias
        const exerciciosPorDia: { [key: string]: any[] } = {};
        
        Object.entries(treinoSemanal)
          .filter(([dia, exercicios]) => exercicios.length > 0)
          .forEach(([dia, exercicios]) => {
            exerciciosPorDia[dia] = exercicios.map(ex => ({
              exercicioId: ex.exercicioId,
              series: ex.series === '' ? 0 : Number(ex.series),
              repeticoes: ex.repeticoes === '' ? 0 : Number(ex.repeticoes),
              carga: ex.carga === '' ? 0 : Number(ex.carga),
              observacoes: ex.observacoes
            }));
          });
        
        await treinoService.criar({
          nome,
          alunoId,
          treinoSemanal: true,
          exerciciosPorDia
        });
      } else {
        await treinoService.criar({
          nome,
          alunoId,
          treinoSemanal: false,
          exercicios: exerciciosSelecionados.map(ex => ({
            exercicioId: ex.exercicioId,
            series: ex.series === '' ? 0 : Number(ex.series),
            repeticoes: ex.repeticoes === '' ? 0 : Number(ex.repeticoes),
            carga: ex.carga === '' ? 0 : Number(ex.carga),
            observacoes: ex.observacoes
          }))
        });
      }

      setSuccess('Treino criado com sucesso!');
      setTimeout(() => {
        navigate('/treinos');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar treino');
    } finally {
      setLoading(false);
    }
  };

  const categorias = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Abdômen', 'Aeróbico'];

  const getExerciciosUsados = () => {
    if (modoSemanal) {
      return treinoSemanal[diaSelecionado].map(ex => ex.exercicioId);
    }
    return exerciciosSelecionados.map(ex => ex.exercicioId);
  };

  const exerciciosFiltrados = exercicios.filter(ex => {
    const matchBusca = ex.nome.toLowerCase().includes(buscaExercicio.toLowerCase()) ||
                      ex.categoria.toLowerCase().includes(buscaExercicio.toLowerCase());
    const matchCategoria = categoriaFiltro === '' || ex.categoria === categoriaFiltro;
    const naoUsado = !getExerciciosUsados().includes(ex.id);
    return matchBusca && matchCategoria && naoUsado;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Criar Treino</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário do Treino */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Informações do Treino</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Treino
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="input-field"
                  placeholder="Ex: Treino Peito e Tríceps"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aluno
                </label>
                <select
                  required
                  value={alunoId}
                  onChange={(e) => setAlunoId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Treino
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!modoSemanal}
                      onChange={() => setModoSemanal(false)}
                      className="mr-2"
                    />
                    Treino Único
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={modoSemanal}
                      onChange={() => setModoSemanal(true)}
                      className="mr-2"
                    />
                    Treino Semanal
                  </label>
                </div>
              </div>

              <div className="pt-4">
                {modoSemanal ? (
                  <div>
                    <h3 className="font-medium mb-2">Treino Semanal</h3>
                    
                    {/* Seletor de Dia */}
                    <div className="mb-3">
                      <select
                        value={diaSelecionado}
                        onChange={(e) => setDiaSelecionado(e.target.value)}
                        className="select-mobile text-sm"
                      >
                        {Object.keys(treinoSemanal).map(dia => (
                          <option key={dia} value={dia}>
                            {dia} ({treinoSemanal[dia].length} exercícios)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Exercícios do Dia Selecionado */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {treinoSemanal[diaSelecionado].length === 0 ? (
                        <p className="text-gray-500 text-sm">Nenhum exercício adicionado para {diaSelecionado}</p>
                      ) : (
                        treinoSemanal[diaSelecionado].map((ex, index) => (
                          <ExercicioCard
                            key={index}
                            exercicio={ex}
                            index={index}
                            onRemover={() => removerExercicio(index, diaSelecionado)}
                            onAtualizar={(campo, valor) => atualizarExercicio(index, campo, valor, diaSelecionado)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium mb-2">Exercícios Selecionados ({exerciciosSelecionados.length})</h3>
                    
                    {exerciciosSelecionados.length === 0 ? (
                      <p className="text-gray-500 text-sm">Nenhum exercício adicionado ainda</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {exerciciosSelecionados.map((ex, index) => (
                          <ExercicioCard
                            key={index}
                            exercicio={ex}
                            index={index}
                            onRemover={() => removerExercicio(index)}
                            onAtualizar={(campo, valor) => atualizarExercicio(index, campo, valor)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Treino'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Exercícios */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Adicionar Exercícios</h2>
            
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar exercícios..."
                  value={buscaExercicio}
                  onChange={(e) => setBuscaExercicio(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <div>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="select-mobile"
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {exerciciosFiltrados.map(exercicio => (
                <div key={exercicio.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium text-sm">{exercicio.nome}</h4>
                    <p className="text-xs text-gray-600">{exercicio.categoria}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => adicionarExercicio(exercicio)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              {exerciciosFiltrados.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  {buscaExercicio ? 'Nenhum exercício encontrado' : 'Nenhum exercício cadastrado'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Componente para card de exercício
const ExercicioCard: React.FC<{
  exercicio: ExercicioSelecionado;
  index: number;
  onRemover: () => void;
  onAtualizar: (campo: string, valor: any) => void;
}> = ({ exercicio, onRemover, onAtualizar }) => (
  <div className="border rounded-lg p-3 bg-gray-50">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-medium text-sm">{exercicio.nome}</h4>
        <p className="text-xs text-gray-600">{exercicio.categoria}</p>
      </div>
      <button
        type="button"
        onClick={onRemover}
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
          value={exercicio.series}
          onChange={(e) => onAtualizar('series', e.target.value === '' ? '' : Number(e.target.value))}
          className="input-field text-xs"
          min="0"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Repetições</label>
        <input
          type="number"
          value={exercicio.repeticoes}
          onChange={(e) => onAtualizar('repeticoes', e.target.value === '' ? '' : Number(e.target.value))}
          className="input-field text-xs"
          min="0"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Carga (kg)</label>
        <input
          type="number"
          value={exercicio.carga}
          onChange={(e) => onAtualizar('carga', e.target.value === '' ? '' : Number(e.target.value))}
          className="input-field text-xs"
          min="0"
          step="0.5"
          placeholder="0"
        />
      </div>
    </div>
    
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Observações (opcional)</label>
      <input
        type="text"
        value={exercicio.observacoes}
        onChange={(e) => onAtualizar('observacoes', e.target.value)}
        className="input-field text-xs"
        placeholder="Ex: Descanso de 60s entre séries"
      />
    </div>
  </div>
);

export default CriarTreino;