import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';
import { conviteService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Convites: React.FC = () => {
  const [convites, setConvites] = useState<any[]>([]);
  const [novoConvite, setNovoConvite] = useState({ nomeAluno: '', emailAluno: '' });
  const [enviandoConvite, setEnviandoConvite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    carregarConvites();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const carregarConvites = async () => {
    try {
      const convitesData = await conviteService.listar();
      setConvites(convitesData);
    } catch (error) {
      setError('Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  };

  const enviarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviandoConvite(true);
    setError('');
    setSuccess('');

    try {
      await conviteService.criar({
        nomeAluno: novoConvite.nomeAluno,
        emailAluno: novoConvite.emailAluno
      });
      
      setSuccess('Convite enviado com sucesso!');
      setNovoConvite({ nomeAluno: '', emailAluno: '' });
      carregarConvites();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar convite');
    } finally {
      setEnviandoConvite(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando convites...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Convites</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Criar Convite */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Convidar Novo Aluno</h2>
            </div>
            
            <form onSubmit={enviarConvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Aluno
                </label>
                <input
                  type="text"
                  placeholder="Nome completo do aluno"
                  value={novoConvite.nomeAluno}
                  onChange={(e) => setNovoConvite({...novoConvite, nomeAluno: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email do Aluno
                </label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={novoConvite.emailAluno}
                  onChange={(e) => setNovoConvite({...novoConvite, emailAluno: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={enviandoConvite}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                {enviandoConvite ? 'Enviando...' : 'Enviar Convite'}
              </button>
            </form>
          </div>

          {/* Lista de Convites */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Convites Enviados</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {convites.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum convite enviado ainda
                </p>
              ) : (
                convites.map((convite, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{convite.nomeAluno}</h3>
                        <p className="text-sm text-gray-600 truncate">{convite.emailAluno}</p>
                        <p className="text-xs text-gray-500">
                          Enviado em {new Date(convite.dataCriacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {convite.status === 'Pendente' && (
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}/cadastro-aluno?token=${convite.token}`;
                              navigator.clipboard.writeText(link);
                              setSuccess('Link copiado!');
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Copiar link do convite"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                        
                        <div className="flex items-center">
                          {convite.status === 'Pendente' && (
                            <div className="flex items-center text-yellow-600" title="Pendente">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-xs">Pendente</span>
                            </div>
                          )}
                          {convite.status === 'Aceito' && (
                            <div className="flex items-center text-green-600" title="Aceito">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Aceito</span>
                            </div>
                          )}
                          {convite.status === 'Expirado' && (
                            <div className="flex items-center text-red-600" title="Expirado">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Expirado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {convite.status === 'Pendente' && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        💡 Copie o link e envie via WhatsApp para o aluno
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Convites;