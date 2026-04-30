import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { authService } from '../services';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, logout, login: contextLogin } = useAuthContext();

  const login = async (email: string, senha: string, tipo: 'professor' | 'aluno') => {
    const response = tipo === 'professor' 
      ? await authService.loginProfessor({ email, senha })
      : await authService.loginAluno({ email, senha });
    
    contextLogin(response.token, {
      id: response.id,
      nome: response.nome,
      email,
      tipoUsuario: response.tipoUsuario as 'Professor' | 'Aluno'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const requireProfessor = () => {
    return user?.tipoUsuario === 'Professor';
  };

  const requireAluno = () => {
    return user?.tipoUsuario === 'Aluno';
  };

  return {
    user,
    login,
    logout,
    handleLogout,
    requireProfessor,
    requireAluno,
    isAuthenticated: !!user
  };
};