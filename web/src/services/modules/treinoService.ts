import api from '../api';
import { CriarTreinoRequest, Treino } from '../../types';

export const treinoService = {
  criar: (data: CriarTreinoRequest): Promise<Treino> =>
    api.post('/api/treino', data).then(res => res.data),
  
  listar: (): Promise<Treino[]> =>
    api.get('/api/treino').then(res => res.data),
  
  obter: (id: string): Promise<Treino> =>
    api.get(`/api/treino/${id}`).then(res => res.data),
  
  atualizar: (id: string, data: any): Promise<Treino> =>
    api.put(`/api/treino/${id}`, data).then(res => res.data),
  
  atualizarCarga: (id: string, data: any): Promise<Treino> =>
    api.put(`/api/treino/${id}/carga`, data).then(res => res.data),
  
  obterHistoricoCarga: (treinoId: string, exercicioId: string, dia?: string): Promise<any[]> =>
    api.get(`/api/treino/${treinoId}/historico/${exercicioId}${dia ? `?dia=${dia}` : ''}`).then(res => res.data),
  
  listarPorAluno: (alunoId: string): Promise<Treino[]> =>
    api.get(`/api/treino/aluno/${alunoId}`).then(res => res.data),
  
  deletar: (id: string): Promise<void> =>
    api.delete(`/api/treino/${id}`).then(res => res.data),
};