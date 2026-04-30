import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Dumbbell, Users, Calendar, Mail, DollarSign, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { exercicioService, treinoService, alunoService } from '../services';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    exercicios: 0,
    treinos: 0,
    alunos: 0
  });
  const [loading, setLoading] = useState(true);

  const carregarEstatisticas = useCallback(async () => {
    if (user?.tipoUsuario === 'Professor') {
      try {
        const [exercicios, treinos, alunos] = await Promise.all([
          exercicioService.listar(),
          treinoService.listar(),
          alunoService.listar()
        ]);
        
        setStats({
          exercicios: exercicios.length,
          treinos: treinos.length,
          alunos: alunos.length
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user?.tipoUsuario === 'Professor') {
      carregarEstatisticas();
    }
  }, [user, carregarEstatisticas]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = user?.tipoUsuario === 'Professor' 
    ? [
        {
          title: 'Criar Exercício',
          description: 'Adicione novos exercícios ao seu banco de dados',
          icon: Plus,
          path: '/exercicios/criar',
          color: 'bg-blue-500'
        },
        {
          title: 'Gerenciar Exercícios',
          description: 'Visualize e edite seus exercícios cadastrados',
          icon: Dumbbell,
          path: '/exercicios',
          color: 'bg-green-500'
        },
        {
          title: 'Criar Treino',
          description: 'Monte treinos personalizados para seus alunos',
          icon: Calendar,
          path: '/treinos/criar',
          color: 'bg-purple-500'
        },
        {
          title: 'Gerenciar Treinos',
          description: 'Visualize e edite os treinos criados',
          icon: Users,
          path: '/treinos',
          color: 'bg-orange-500'
        },
        {
          title: 'Gerenciar Convites',
          description: 'Convide novos alunos e gerencie convites',
          icon: Mail,
          path: '/convites',
          color: 'bg-blue-500'
        },
        {
          title: 'Calendário',
          description: 'Agende e gerencie aulas com seus alunos',
          icon: Calendar,
          path: '/calendario',
          color: 'bg-indigo-500'
        },
        {
          title: 'Financeiro',
          description: 'Controle de caixa e relatórios de aulas',
          icon: DollarSign,
          path: '/financeiro',
          color: 'bg-green-500'
        },
        {
          title: 'Bioimpedância',
          description: 'Avaliações corporais e composição corporal',
          icon: Activity,
          path: '/bioimpedancia',
          color: 'bg-teal-500'
        }
      ]
    : [
        {
          title: 'Meus Treinos',
          description: 'Visualize seus treinos e atualize as cargas',
          icon: Dumbbell,
          path: '/meus-treinos',
          color: 'bg-primary-500'
        },
        {
          title: 'Minhas Aulas',
          description: 'Visualize suas aulas agendadas',
          icon: Calendar,
          path: '/calendario',
          color: 'bg-indigo-500'
        },
        {
          title: 'Minhas Avaliações',
          description: 'Visualize suas avaliações corporais',
          icon: Activity,
          path: '/bioimpedancia',
          color: 'bg-teal-500'
        }
      ];

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.nome}!
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie seus exercícios e treinos de forma simples e eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${item.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {user?.tipoUsuario === 'Professor' && (
          <div className="card mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {loading ? '...' : stats.exercicios}
                </div>
                <div className="text-sm text-gray-600">Exercícios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {loading ? '...' : stats.treinos}
                </div>
                <div className="text-sm text-gray-600">Treinos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {loading ? '...' : stats.alunos}
                </div>
                <div className="text-sm text-gray-600">Alunos</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;