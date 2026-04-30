import { useState, useEffect } from 'react';
import { treinoService } from '../services';
import { Treino } from '../types';
import { handleApiError } from '../utils/errorHandler';

export const useTreinos = () => {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTreinos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await treinoService.listar();
      setTreinos(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const criarTreino = async (treino: any) => {
    try {
      setLoading(true);
      setError('');
      const novoTreino = await treinoService.criar(treino);
      setTreinos(prev => [...prev, novoTreino]);
      return novoTreino;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarTreino = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await treinoService.deletar(id);
      setTreinos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreinos();
  }, []);

  return {
    treinos,
    loading,
    error,
    loadTreinos,
    criarTreino,
    deletarTreino
  };
};