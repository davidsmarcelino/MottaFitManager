import api from '../api';

export const bioimpedanciaService = {
  criar: (data: any): Promise<any> =>
    api.post('/api/bioimpedancia/criar', data).then(res => res.data),
  
  listar: (): Promise<any[]> =>
    api.get('/api/bioimpedancia/listar').then(res => res.data),
  
  comparar: (alunoId: string): Promise<any> =>
    api.get(`/api/bioimpedancia/comparar/${alunoId}`).then(res => res.data),
};