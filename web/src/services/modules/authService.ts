import api from '../api';
import { LoginRequest, LoginResponse } from '../../types';

export const authService = {
  loginProfessor: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/api/auth/login/professor', data).then(res => res.data),
  
  loginAluno: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/api/auth/login/aluno', data).then(res => res.data),
};