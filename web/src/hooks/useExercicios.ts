import { useState, useEffect } from 'react';
import { exercicioService } from '../services';
import { Exercicio } from '../types';
import { handleApiError } from '../utils/errorHandler';

export const useExercicios = () => {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadExercicios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await exercicioService.listar();
      setExercicios(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const criarExercicio = async (exercicio: any) => {
    try {
      setLoading(true);
      setError('');
      const novoExercicio = await exercicioService.criar(exercicio);
      setExercicios(prev => [...prev, novoExercicio]);
      return novoExercicio;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarExercicio = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await exercicioService.deletar(id);
      setExercicios(prev => prev.filter(ex => ex.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercicios();
  }, []);

  return {
    exercicios,
    loading,
    error,
    loadExercicios,
    criarExercicio,
    deletarExercicio
  };
};