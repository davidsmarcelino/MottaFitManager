import api from '../api';

export const aulaService = {
  criar: (data: any): Promise<any> =>
    api.post('/api/aula/criar', data).then(res => res.data),
  
  listar: (): Promise<any[]> =>
    api.get('/api/aula/listar').then(res => res.data),
  
  atualizar: (id: string, data: any): Promise<any> =>
    api.put(`/api/aula/atualizar/${id}`, data).then(res => res.data),
  
  atualizarStatus: (id: string, status: string): Promise<any> =>
    api.put(`/api/aula/status/${id}`, { status }).then(res => res.data),
  
  remarcar: (id: string, data: any): Promise<any> =>
    api.post(`/api/aula/remarcar/${id}`, data).then(res => res.data),
  
  deletar: (id: string): Promise<void> =>
    api.delete(`/api/aula/deletar/${id}`).then(res => res.data),
};