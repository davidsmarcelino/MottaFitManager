import api from '../api';
import { ExercicioRequest, Exercicio } from '../../types';

export const exercicioService = {
  criar: (data: ExercicioRequest): Promise<Exercicio> =>
    api.post('/api/exercicio/criar', data).then(res => res.data),
  
  listar: (): Promise<Exercicio[]> =>
    api.get('/api/exercicio/listar').then(res => res.data),
  
  obter: (id: string): Promise<Exercicio> =>
    api.get(`/api/exercicio/buscar/${id}`).then(res => res.data),
  
  atualizar: (id: string, data: ExercicioRequest): Promise<Exercicio> =>
    api.put(`/api/exercicio/atualizar/${id}`, data).then(res => res.data),
  
  deletar: (id: string): Promise<void> =>
    api.delete(`/api/exercicio/deletar/${id}`).then(res => res.data),
};