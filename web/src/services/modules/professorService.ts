import api from '../api';

export const professorService = {
  cadastrar: (data: { nome: string; email: string; senha: string }): Promise<any> =>
    api.post('/api/professor/cadastrar', data).then(res => res.data),
};