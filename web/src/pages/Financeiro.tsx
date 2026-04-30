import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calendar, Users, Edit2, Check, X } from 'lucide-react';
import { alunoService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

interface RelatorioAluno {
  id: string;
  nome: string;
  valorAula: number;
  aulasRealizadas: number;
  aulasFaltou: number;
  aulasAgendadas: number;
  aulasRemarcadas: number;
  totalAulas: number;
  totalCobrar: number;
  valorPago: number;
  valorPendente: number;
  jaPagou: boolean;
  formaPagamento?: string;
  dataPagamento?: string;
}

const Financeiro: React.FC = () => {
  const [relatorio, setRelatorio] = useState<RelatorioAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mesAno, setMesAno] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  });
  const [editandoValor, setEditandoValor] = useState<string | null>(null);
  const [novoValor, setNovoValor] = useState('');
  const [filtroAluno, setFiltroAluno] = useState('');
  const [marcandoPagamento, setMarcandoPagamento] = useState<RelatorioAluno | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('PIX');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const carregarRelatorio = useCallback(async () => {
    try {
      setLoading(true);
      const [ano, mes] = mesAno.split('-');
      const data = await alunoService.relatorioFinanceiro(parseInt(mes), parseInt(ano));
      setRelatorio(data);
    } catch (err: any) {
      setError('Erro ao carregar relatório financeiro');
    } finally {
      setLoading(false);
    }
  }, [mesAno]);

  useEffect(() => {
    carregarRelatorio();
  }, [carregarRelatorio]);

  const atualizarValorAula = async (alunoId: string, valor: number) => {
    try {
      await alunoService.atualizarValorAula(alunoId, valor);
      setSuccess('Valor da aula atualizado!');
      setEditandoValor(null);
      carregarRelatorio();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar valor');
    }
  };

  const iniciarEdicao = (aluno: RelatorioAluno) => {
    setEditandoValor(aluno.id);
    setNovoValor(aluno.valorAula.toString());
  };

  const cancelarEdicao = () => {
    setEditandoValor(null);
    setNovoValor('');
  };

  const confirmarEdicao = (alunoId: string) => {
    const valor = parseFloat(novoValor);
    if (valor >= 0) {
      atualizarValorAula(alunoId, valor);
    }
  };

  const marcarPagamento = (aluno: RelatorioAluno) => {
    setMarcandoPagamento(aluno);
  };

  const confirmarPagamento = async () => {
    if (!marcandoPagamento) return;
    
    try {
      const [ano, mes] = mesAno.split('-');
      await alunoService.marcarPagamento({
        alunoId: marcandoPagamento.id,
        mes: parseInt(mes),
        ano: parseInt(ano),
        valor: marcandoPagamento.valorPendente,
        formaPagamento
      });
      
      setSuccess('Pagamento marcado com sucesso!');
      setMarcandoPagamento(null);
      carregarRelatorio();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao marcar pagamento');
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const relatarioFiltrado = relatorio.filter(aluno => aluno.nome.toLowerCase().includes(filtroAluno.toLowerCase()));
  const totalGeral = relatarioFiltrado.reduce((acc, aluno) => acc + aluno.valorPendente, 0);
  const totalRecebido = relatarioFiltrado.reduce((acc, aluno) => acc + aluno.valorPago, 0);
  const totalAulasGeral = relatarioFiltrado.reduce((acc, aluno) => acc + aluno.totalAulas, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatório...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Controle Financeiro</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <input
                type="month"
                value={mesAno}
                onChange={(e) => setMesAno(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
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

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{formatarMoeda(totalGeral)}</div>
            <div className="text-sm text-gray-600">Total a Receber</div>
          </div>
          
          <div className="card text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{formatarMoeda(totalRecebido)}</div>
            <div className="text-sm text-gray-600">Total Recebido</div>
          </div>
          
          <div className="card text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{relatarioFiltrado.length}</div>
            <div className="text-sm text-gray-600">Alunos Ativos</div>
          </div>
          
          <div className="card text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{totalAulasGeral}</div>
            <div className="text-sm text-gray-600">Aulas Cobráveis</div>
          </div>
        </div>

        {/* Filtro de Alunos */}
        <div className="card mb-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar aluno:</label>
            <input
              type="text"
              placeholder="Digite o nome do aluno..."
              value={filtroAluno}
              onChange={(e) => setFiltroAluno(e.target.value)}
              className="input-field flex-1 max-w-md"
            />
          </div>
        </div>

        {/* Tabela de Alunos */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Valor/Aula</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Realizadas</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faltou</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Agendadas</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">A Receber</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {relatorio
                  .filter(aluno => aluno.nome.toLowerCase().includes(filtroAluno.toLowerCase()))
                  .map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{aluno.nome}</div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {editandoValor === aluno.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="number"
                            value={novoValor}
                            onChange={(e) => setNovoValor(e.target.value)}
                            className="input-field text-sm w-20"
                            step="0.01"
                            min="0"
                          />
                          <button
                            onClick={() => confirmarEdicao(aluno.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelarEdicao}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm font-medium">{formatarMoeda(aluno.valorAula)}</span>
                          <button
                            onClick={() => iniciarEdicao(aluno)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {aluno.aulasRealizadas}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {aluno.aulasFaltou}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {aluno.aulasAgendadas}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="font-medium">{aluno.totalAulas}</span>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-lg font-bold text-green-600">
                          {formatarMoeda(aluno.totalCobrar)}
                        </span>
                        {aluno.valorPago > 0 && (
                          <span className="text-sm text-green-600">
                            Pago: {formatarMoeda(aluno.valorPago)}
                          </span>
                        )}
                        {aluno.valorPendente > 0 && (
                          <button
                            onClick={() => marcarPagamento(aluno)}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Pagar: {formatarMoeda(aluno.valorPendente)}
                          </button>
                        )}
                        {aluno.valorPendente === 0 && aluno.valorPago > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Quitado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {relatarioFiltrado.length === 0 && filtroAluno === '' && (
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum dado financeiro encontrado para este período.</p>
            </div>
          )}
          
          {relatarioFiltrado.length === 0 && filtroAluno !== '' && (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum aluno encontrado com o nome "{filtroAluno}".</p>
            </div>
          )}
          
          {relatorio.length === 0 && filtroAluno === '' && (
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum dado financeiro encontrado para este período.</p>
            </div>
          )}
        </div>

        {/* Modal Marcar Pagamento */}
        {marcandoPagamento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Marcar Pagamento</h2>
                  <button
                    onClick={() => setMarcandoPagamento(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{marcandoPagamento.nome}</p>
                    <p className="text-sm text-gray-600">Total: {formatarMoeda(marcandoPagamento.totalCobrar)}</p>
                    <p className="text-sm text-gray-600">Já pago: {formatarMoeda(marcandoPagamento.valorPago)}</p>
                    <p className="text-sm font-medium text-red-600">A pagar: {formatarMoeda(marcandoPagamento.valorPendente)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forma de Pagamento
                    </label>
                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      className="input-field"
                    >
                      <option value="PIX">PIX</option>
                      <option value="Boleto">Boleto</option>
                      <option value="Cartao">Cartão</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Transferencia">Transferência</option>
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setMarcandoPagamento(null)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarPagamento}
                      className="flex-1 btn-primary"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Financeiro;