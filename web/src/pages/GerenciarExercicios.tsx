import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Filter } from 'lucide-react';
import { exercicioService } from '../services';
import { Exercicio } from '../types';
import Layout from '../components/Layout';
import { PageHeader } from '../components/common/PageHeader';
import { AlertMessage } from '../components/common/AlertMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { CATEGORIAS_EXERCICIO } from '../utils/constants';

const GerenciarExercicios: React.FC = () => {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState<Exercicio[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [editando, setEditando] = useState<Exercicio | null>(null);

  const { user, handleLogout } = useAuth();
  const { loading, error, execute } = useApi();

  useEffect(() => {
    carregarExercicios();
  }, []);

  const carregarExercicios = async () => {
    const data = await execute(() => exercicioService.listar());
    if (data) {
      setExercicios(data);
      setExerciciosFiltrados(data);
    }
  };

  const filtrarPorCategoria = (categoria: string) => {
    setCategoriaFiltro(categoria);
    setExerciciosFiltrados(categoria === '' ? exercicios : exercicios.filter(e => e.categoria === categoria));
  };

  const handleEditar = async (exercicio: Exercicio) => {
    const success = await execute(() => exercicioService.atualizar(exercicio.id, {
      nome: exercicio.nome,
      categoria: exercicio.categoria,
      videoUrl: exercicio.videoUrl
    }));
    
    if (success) {
      setEditando(null);
      carregarExercicios();
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este exercício?')) {
      const success = await execute(() => exercicioService.deletar(id));
      if (success) carregarExercicios();
    }
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <LoadingSpinner message="Carregando exercícios..." />
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Gerenciar Exercícios"
          action={
            <button
              onClick={() => window.location.href = '/exercicios/criar'}
              className="btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Exercício
            </button>
          }
        />

        <AlertMessage type="error" message={error} />

        {/* Filtro por Categoria */}
        <div className="filter-card">
          <div className="flex items-start space-x-3">
            <Filter className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Categoria
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => filtrarPorCategoria(e.target.value)}
                className="select-mobile"
              >
                <option value="">Todas ({exercicios.length})</option>
                {CATEGORIAS_EXERCICIO.map(categoria => {
                  const exerciciosDaCategoria = exercicios.filter(e => e.categoria === categoria).length;
                  return (
                    <option key={categoria} value={categoria}>
                      {categoria} ({exerciciosDaCategoria})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {exerciciosFiltrados.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-600 mb-4">
              {categoriaFiltro ? 'Nenhum exercício encontrado para esta categoria.' : 'Nenhum exercício cadastrado ainda.'}
            </p>
            <button
              onClick={() => window.location.href = '/exercicios/criar'}
              className="btn-primary"
            >
              Criar Primeiro Exercício
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciciosFiltrados.map((exercicio) => (
              <div key={exercicio.id} className="card">
                {editando?.id === exercicio.id ? (
                  <EditForm
                    exercicio={editando}
                    onSave={handleEditar}
                    onCancel={() => setEditando(null)}
                    onChange={setEditando}
                  />
                ) : (
                  <ExercicioCard
                    exercicio={exercicio}
                    onEdit={() => setEditando(exercicio)}
                    onDelete={() => handleDeletar(exercicio.id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const ExercicioCard: React.FC<{
  exercicio: Exercicio;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ exercicio, onEdit, onDelete }) => (
  <>
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-gray-900">{exercicio.nome}</h3>
      <div className="flex space-x-2">
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
          <Edit className="h-4 w-4" />
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="space-y-2 text-sm text-gray-600">
      <p><span className="font-medium">Categoria:</span> {exercicio.categoria}</p>
      {exercicio.videoUrl && (
        <a
          href={exercicio.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 block"
        >
          Ver vídeo
        </a>
      )}
    </div>
  </>
);

const EditForm: React.FC<{
  exercicio: Exercicio;
  onSave: (exercicio: Exercicio) => void;
  onCancel: () => void;
  onChange: (exercicio: Exercicio) => void;
}> = ({ exercicio, onSave, onCancel, onChange }) => (
  <div className="space-y-3">
    <input
      type="text"
      value={exercicio.nome}
      onChange={(e) => onChange({ ...exercicio, nome: e.target.value })}
      className="input-field text-sm"
      placeholder="Nome"
    />
    
    <select
      value={exercicio.categoria}
      onChange={(e) => onChange({ ...exercicio, categoria: e.target.value })}
      className="select-mobile text-sm"
    >
      {CATEGORIAS_EXERCICIO.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
    

    
    <input
      type="url"
      value={exercicio.videoUrl || ''}
      onChange={(e) => onChange({ ...exercicio, videoUrl: e.target.value })}
      className="input-field text-sm"
      placeholder="URL do vídeo"
    />
    
    <div className="flex space-x-2">
      <button onClick={() => onSave(exercicio)} className="btn-primary text-sm flex-1">
        Salvar
      </button>
      <button onClick={onCancel} className="btn-secondary text-sm">
        Cancelar
      </button>
    </div>
  </div>
);

export default GerenciarExercicios;