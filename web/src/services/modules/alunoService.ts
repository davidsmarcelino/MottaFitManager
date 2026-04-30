import api from '../api';

export const alunoService = {
  listar: (): Promise<any[]> =>
    api.get('/api/aluno/listar').then(res => res.data),
  
  atualizarValorAula: (id: string, valor: number): Promise<any> =>
    api.put(`/api/aluno/valor-aula/${id}`, valor).then(res => res.data),
  
  relatorioFinanceiro: (mes?: number, ano?: number): Promise<any[]> => {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (ano) params.append('ano', ano.toString());
    return api.get(`/api/aluno/relatorio-financeiro?${params}`).then(res => res.data);
  },
  
  marcarPagamento: (data: any): Promise<any> =>
    api.post('/api/aluno/marcar-pagamento', data).then(res => res.data),
};